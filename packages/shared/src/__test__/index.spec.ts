import { isString } from '../index'

test('isString should work', () => {
	expect(isString(11)).toBeFalsy()
	expect(isString('11')).toBeTruthy()
	expect(isString({})).toBeFalsy()
})
