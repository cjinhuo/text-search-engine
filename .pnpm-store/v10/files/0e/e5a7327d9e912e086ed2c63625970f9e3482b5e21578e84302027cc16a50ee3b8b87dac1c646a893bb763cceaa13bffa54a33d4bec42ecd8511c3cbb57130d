import { isForcedMotionValue } from '../../../motion/utils/is-forced-motion-value.mjs';
import { isMotionValue } from '../../../value/utils/is-motion-value.mjs';

function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    var _a;
    const { style } = props;
    const newValues = {};
    for (const key in style) {
        if (isMotionValue(style[key]) ||
            (prevProps.style &&
                isMotionValue(prevProps.style[key])) ||
            isForcedMotionValue(key, props) ||
            ((_a = visualElement === null || visualElement === void 0 ? void 0 : visualElement.getValue(key)) === null || _a === void 0 ? void 0 : _a.liveStyle) !== undefined) {
            newValues[key] = style[key];
        }
    }
    /**
     * If the willChange style has been manually set as a string, set
     * applyWillChange to false to prevent it from automatically being applied.
     */
    if (visualElement && style && typeof style.willChange === "string") {
        visualElement.applyWillChange = false;
    }
    return newValues;
}

export { scrapeMotionValuesFromProps };
