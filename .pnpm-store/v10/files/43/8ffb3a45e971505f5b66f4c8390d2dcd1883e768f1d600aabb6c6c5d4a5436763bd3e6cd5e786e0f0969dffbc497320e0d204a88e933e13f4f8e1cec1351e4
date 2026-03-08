import { WillChangeMotionValue } from './WillChangeMotionValue.mjs';
import { isWillChangeMotionValue } from './is.mjs';

function addValueToWillChange(visualElement, key) {
    var _a;
    if (!visualElement.applyWillChange)
        return;
    let willChange = visualElement.getValue("willChange");
    /**
     * If we haven't created a willChange MotionValue, and the we haven't been
     * manually provided one, create one.
     */
    if (!willChange && !((_a = visualElement.props.style) === null || _a === void 0 ? void 0 : _a.willChange)) {
        willChange = new WillChangeMotionValue("auto");
        visualElement.addValue("willChange", willChange);
    }
    /**
     * It could be that a user has set willChange to a regular MotionValue,
     * in which case we can't add the value to it.
     */
    if (isWillChangeMotionValue(willChange)) {
        return willChange.add(key);
    }
}

export { addValueToWillChange };
