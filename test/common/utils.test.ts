import { describe, expect, test } from '@jest/globals'
import { Utils } from '../../src/common/utils'

describe('utils', () => {
	test('basic rows and cols', () => {
		expect(Utils.fill('o', 5)).toStrictEqual(['o', 'o', 'o', 'o', 'o'])
	})
	test('fill avoids duplicates', () => {
		const matrix: string[][] = Utils.fill(Utils.fill(' ', 10), 10)
		expect(matrix[0][0]).toBe(' ')
		expect(matrix[1][0]).toBe(' ')
		matrix[0][0] = 'a'
		expect(matrix[0][0]).toBe('a')
		expect(matrix[1][0]).toBe(' ')
	})
	test('grouped', () => {
		const a = Utils.grouped([1, 2, 3, 4, 5], 2)
		expect(a).toStrictEqual([[1, 2], [3, 4], [5]])
	})
})
