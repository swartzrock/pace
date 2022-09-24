import { describe, expect, test } from '@jest/globals'
import { StringUtils } from '../../src/common/stringutils'

describe('stringutils', () => {
	test('reverse', () => {
		expect(StringUtils.reverse('abc')).toBe('cba')
	})
	test('takeRight', () => {
		expect(StringUtils.takeRight('Hello', 2)).toBe('lo')
	})
})
