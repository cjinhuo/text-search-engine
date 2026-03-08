import { isBezierDefinition } from '../../../easing/utils/is-bezier-definition.mjs';

function isWaapiSupportedEasing(easing) {
    return Boolean(!easing ||
        (typeof easing === "string" && easing in supportedWaapiEasing) ||
        isBezierDefinition(easing) ||
        (Array.isArray(easing) && easing.every(isWaapiSupportedEasing)));
}
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
const supportedWaapiEasing = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: cubicBezierAsString([0, 0.65, 0.55, 1]),
    circOut: cubicBezierAsString([0.55, 0, 1, 0.45]),
    backIn: cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
    backOut: cubicBezierAsString([0.33, 1.53, 0.69, 0.99]),
};
function mapEasingToNativeEasingWithDefault(easing) {
    return (mapEasingToNativeEasing(easing) ||
        supportedWaapiEasing.easeOut);
}
function mapEasingToNativeEasing(easing) {
    if (!easing) {
        return undefined;
    }
    else if (isBezierDefinition(easing)) {
        return cubicBezierAsString(easing);
    }
    else if (Array.isArray(easing)) {
        return easing.map(mapEasingToNativeEasingWithDefault);
    }
    else {
        return supportedWaapiEasing[easing];
    }
}

export { cubicBezierAsString, isWaapiSupportedEasing, mapEasingToNativeEasing, supportedWaapiEasing };
