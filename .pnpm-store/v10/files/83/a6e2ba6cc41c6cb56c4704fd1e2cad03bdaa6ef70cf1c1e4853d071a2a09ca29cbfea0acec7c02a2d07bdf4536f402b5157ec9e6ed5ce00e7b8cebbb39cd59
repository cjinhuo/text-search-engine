import { useContext } from 'react';
import { isAnimationControls } from '../../animation/utils/is-animation-controls.mjs';
import { PresenceContext } from '../../context/PresenceContext.mjs';
import { resolveVariantFromProps } from '../../render/utils/resolve-variants.mjs';
import { useConstant } from '../../utils/use-constant.mjs';
import { resolveMotionValue } from '../../value/utils/resolve-motion-value.mjs';
import { MotionContext } from '../../context/MotionContext/index.mjs';
import { isControllingVariants, isVariantNode } from '../../render/utils/is-controlling-variants.mjs';
import { getWillChangeName } from '../../value/use-will-change/get-will-change-name.mjs';
import { addUniqueItem } from '../../utils/array.mjs';

function makeState({ applyWillChange = false, scrapeMotionValuesFromProps, createRenderState, onMount, }, props, context, presenceContext, isStatic) {
    const state = {
        latestValues: makeLatestValues(props, context, presenceContext, isStatic ? false : applyWillChange, scrapeMotionValuesFromProps),
        renderState: createRenderState(),
    };
    if (onMount) {
        state.mount = (instance) => onMount(props, instance, state);
    }
    return state;
}
const makeUseVisualState = (config) => (props, isStatic) => {
    const context = useContext(MotionContext);
    const presenceContext = useContext(PresenceContext);
    const make = () => makeState(config, props, context, presenceContext, isStatic);
    return isStatic ? make() : useConstant(make);
};
function addWillChange(willChange, name) {
    const memberName = getWillChangeName(name);
    if (memberName) {
        addUniqueItem(willChange, memberName);
    }
}
function forEachDefinition(props, definition, callback) {
    const list = Array.isArray(definition) ? definition : [definition];
    for (let i = 0; i < list.length; i++) {
        const resolved = resolveVariantFromProps(props, list[i]);
        if (resolved) {
            const { transitionEnd, transition, ...target } = resolved;
            callback(target, transitionEnd);
        }
    }
}
function makeLatestValues(props, context, presenceContext, shouldApplyWillChange, scrapeMotionValues) {
    var _a;
    const values = {};
    const willChange = [];
    const applyWillChange = shouldApplyWillChange && ((_a = props.style) === null || _a === void 0 ? void 0 : _a.willChange) === undefined;
    const motionValues = scrapeMotionValues(props, {});
    for (const key in motionValues) {
        values[key] = resolveMotionValue(motionValues[key]);
    }
    let { initial, animate } = props;
    const isControllingVariants$1 = isControllingVariants(props);
    const isVariantNode$1 = isVariantNode(props);
    if (context &&
        isVariantNode$1 &&
        !isControllingVariants$1 &&
        props.inherit !== false) {
        if (initial === undefined)
            initial = context.initial;
        if (animate === undefined)
            animate = context.animate;
    }
    let isInitialAnimationBlocked = presenceContext
        ? presenceContext.initial === false
        : false;
    isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
    const variantToSet = isInitialAnimationBlocked ? animate : initial;
    if (variantToSet &&
        typeof variantToSet !== "boolean" &&
        !isAnimationControls(variantToSet)) {
        forEachDefinition(props, variantToSet, (target, transitionEnd) => {
            for (const key in target) {
                let valueTarget = target[key];
                if (Array.isArray(valueTarget)) {
                    /**
                     * Take final keyframe if the initial animation is blocked because
                     * we want to initialise at the end of that blocked animation.
                     */
                    const index = isInitialAnimationBlocked
                        ? valueTarget.length - 1
                        : 0;
                    valueTarget = valueTarget[index];
                }
                if (valueTarget !== null) {
                    values[key] = valueTarget;
                }
            }
            for (const key in transitionEnd) {
                values[key] = transitionEnd[key];
            }
        });
    }
    // Add animating values to will-change
    if (applyWillChange) {
        if (animate && initial !== false && !isAnimationControls(animate)) {
            forEachDefinition(props, animate, (target) => {
                for (const key in target) {
                    addWillChange(willChange, key);
                }
            });
        }
        if (willChange.length) {
            values.willChange = willChange.join(",");
        }
    }
    return values;
}

export { makeUseVisualState };
