import { useContext, useRef, useInsertionEffect, useEffect } from 'react';
import { PresenceContext } from '../../context/PresenceContext.mjs';
import { MotionContext } from '../../context/MotionContext/index.mjs';
import { useIsomorphicLayoutEffect } from '../../utils/use-isomorphic-effect.mjs';
import { LazyContext } from '../../context/LazyContext.mjs';
import { MotionConfigContext } from '../../context/MotionConfigContext.mjs';
import { optimizedAppearDataAttribute } from '../../animation/optimized-appear/data-id.mjs';
import { microtask } from '../../frameloop/microtask.mjs';
import { isRefObject } from '../../utils/is-ref-object.mjs';
import { SwitchLayoutGroupContext } from '../../context/SwitchLayoutGroupContext.mjs';

let scheduleHandoffComplete = false;
function useVisualElement(Component, visualState, props, createVisualElement, ProjectionNodeConstructor) {
    var _a;
    const { visualElement: parent } = useContext(MotionContext);
    const lazyContext = useContext(LazyContext);
    const presenceContext = useContext(PresenceContext);
    const reducedMotionConfig = useContext(MotionConfigContext).reducedMotion;
    const visualElementRef = useRef();
    /**
     * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
     */
    createVisualElement = createVisualElement || lazyContext.renderer;
    if (!visualElementRef.current && createVisualElement) {
        visualElementRef.current = createVisualElement(Component, {
            visualState,
            parent,
            props,
            presenceContext,
            blockInitialAnimation: presenceContext
                ? presenceContext.initial === false
                : false,
            reducedMotionConfig,
        });
    }
    const visualElement = visualElementRef.current;
    /**
     * Load Motion gesture and animation features. These are rendered as renderless
     * components so each feature can optionally make use of React lifecycle methods.
     */
    const initialLayoutGroupConfig = useContext(SwitchLayoutGroupContext);
    if (visualElement &&
        !visualElement.projection &&
        ProjectionNodeConstructor &&
        (visualElement.type === "html" || visualElement.type === "svg")) {
        createProjectionNode(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
    }
    useInsertionEffect(() => {
        visualElement && visualElement.update(props, presenceContext);
    });
    /**
     * Cache this value as we want to know whether HandoffAppearAnimations
     * was present on initial render - it will be deleted after this.
     */
    const optimisedAppearId = props[optimizedAppearDataAttribute];
    const wantsHandoff = useRef(Boolean(optimisedAppearId) &&
        !window.MotionHandoffIsComplete &&
        ((_a = window.MotionHasOptimisedAnimation) === null || _a === void 0 ? void 0 : _a.call(window, optimisedAppearId)));
    useIsomorphicLayoutEffect(() => {
        if (!visualElement)
            return;
        visualElement.updateFeatures();
        microtask.render(visualElement.render);
        /**
         * Ideally this function would always run in a useEffect.
         *
         * However, if we have optimised appear animations to handoff from,
         * it needs to happen synchronously to ensure there's no flash of
         * incorrect styles in the event of a hydration error.
         *
         * So if we detect a situtation where optimised appear animations
         * are running, we use useLayoutEffect to trigger animations.
         */
        if (wantsHandoff.current && visualElement.animationState) {
            visualElement.animationState.animateChanges();
        }
    });
    useEffect(() => {
        if (!visualElement)
            return;
        if (!wantsHandoff.current && visualElement.animationState) {
            visualElement.animationState.animateChanges();
        }
        wantsHandoff.current = false;
        // This ensures all future calls to animateChanges() will run in useEffect
        if (!scheduleHandoffComplete) {
            scheduleHandoffComplete = true;
            queueMicrotask(completeHandoff);
        }
    });
    return visualElement;
}
function completeHandoff() {
    window.MotionHandoffIsComplete = true;
}
function createProjectionNode(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
    const { layoutId, layout, drag, dragConstraints, layoutScroll, layoutRoot, } = props;
    visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"]
        ? undefined
        : getClosestProjectingNode(visualElement.parent));
    visualElement.projection.setOptions({
        layoutId,
        layout,
        alwaysMeasureLayout: Boolean(drag) || (dragConstraints && isRefObject(dragConstraints)),
        visualElement,
        /**
         * TODO: Update options in an effect. This could be tricky as it'll be too late
         * to update by the time layout animations run.
         * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
         * ensuring it gets called if there's no potential layout animations.
         *
         */
        animationType: typeof layout === "string" ? layout : "both",
        initialPromotionConfig,
        layoutScroll,
        layoutRoot,
    });
}
function getClosestProjectingNode(visualElement) {
    if (!visualElement)
        return undefined;
    return visualElement.options.allowProjection !== false
        ? visualElement.projection
        : getClosestProjectingNode(visualElement.parent);
}

export { useVisualElement };
