import { webAdd, webIsString } from '../index'

test('webAdd should work', () => {
	expect(webAdd(1, 2)).toBe(3)
})

test('webIsString should work', () => {
	expect(webIsString('1')).toBeTruthy()
	expect(webIsString(2)).toBeFalsy()
	expect(webIsString(false)).toBeFalsy()
})
