import { transformProps } from '../../render/html/utils/transform.mjs';
import { appearAnimationStore } from './store.mjs';
import { appearStoreId } from './store-id.mjs';

let handoffFrameTime;
function handoffOptimizedAppearAnimation(elementId, valueName, frame) {
    const optimisedValueName = transformProps.has(valueName)
        ? "transform"
        : valueName;
    const storeId = appearStoreId(elementId, optimisedValueName);
    const optimisedAnimation = appearAnimationStore.get(storeId);
    if (!optimisedAnimation) {
        return null;
    }
    const { animation, startTime } = optimisedAnimation;
    if (startTime === null || window.MotionHandoffIsComplete) {
        /**
         * If the startTime is null, this animation is the Paint Ready detection animation
         * and we can cancel it immediately without handoff.
         *
         * Or if we've already handed off the animation then we're now interrupting it.
         * In which case we need to cancel it.
         */
        appearAnimationStore.delete(storeId);
        frame.render(() => frame.render(() => {
            try {
                animation.cancel();
            }
            catch (error) { }
        }));
        return null;
    }
    else {
        /**
         * Otherwise we're starting a main thread animation.
         *
         * Record the time of the first handoff. We call performance.now() once
         * here and once in startOptimisedAnimation to ensure we're getting
         * close to a frame-locked time. This keeps all animations in sync.
         */
        if (handoffFrameTime === undefined) {
            handoffFrameTime = performance.now();
        }
        /**
         * We use main thread timings vs those returned by Animation.currentTime as it
         * can be the case, particularly in Firefox, that currentTime doesn't return
         * an updated value for several frames, even as the animation plays smoothly via
         * the GPU.
         */
        return handoffFrameTime - startTime || 0;
    }
}

export { handoffOptimizedAppearAnimation };
