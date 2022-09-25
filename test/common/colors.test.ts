import { describe, expect, test } from '@jest/globals'
import { Colors, Xterm256 } from '../../src/common/colors'

describe('colors', () => {
	test('colorName', () => {
		expect(Colors.colorName(Xterm256.RED)).toBe('RED')
		expect(Colors.colorName(Xterm256.GREEN_1)).toBe('GREEN_1')
		expect(Colors.colorName(Xterm256.LIGHTCYAN_1)).toBe('LIGHTCYAN_1')
	})
	test('detectColor', () => {
		const greenText = Colors.foregroundColor('c', 46)
		expect(Colors.detectFgColor(greenText)).toBe(46)
	})
})
