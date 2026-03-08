import { MotionValue } from '../index.mjs';
import { getWillChangeName } from './get-will-change-name.mjs';
import { removeItem } from '../../utils/array.mjs';

class WillChangeMotionValue extends MotionValue {
    constructor() {
        super(...arguments);
        this.output = [];
        this.counts = new Map();
    }
    add(name) {
        const styleName = getWillChangeName(name);
        if (!styleName)
            return;
        /**
         * Update counter. Each value has an indepdent counter
         * as multiple sources could be requesting the same value
         * gets added to will-change.
         */
        const prevCount = this.counts.get(styleName) || 0;
        this.counts.set(styleName, prevCount + 1);
        if (prevCount === 0) {
            this.output.push(styleName);
            this.update();
        }
        /**
         * Prevents the remove function from being called multiple times.
         */
        let hasRemoved = false;
        return () => {
            if (hasRemoved)
                return;
            hasRemoved = true;
            const newCount = this.counts.get(styleName) - 1;
            this.counts.set(styleName, newCount);
            if (newCount === 0) {
                removeItem(this.output, styleName);
                this.update();
            }
        };
    }
    update() {
        this.set(this.output.length ? this.output.join(", ") : "auto");
    }
}

export { WillChangeMotionValue };
