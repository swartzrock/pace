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
	test('range', () => {
		expect(Utils.createArrayRange(3, 6)).toStrictEqual([3, 4, 5, 6])
		expect(Utils.createArrayRange(6, 3)).toStrictEqual([6, 5, 4, 3])
	})
	test('concat', () => {
		expect(Utils.concat([1, 2], [3, 4], [5])).toStrictEqual([1, 2, 3, 4, 5])
	})
	test('double', () => {
		const a = ['h','e','l','l','o']
		expect(Utils.doubleArray(a)).toStrictEqual(['h','h','e','e','l','l','l','l','o','o'])

		const m = [[7,8,9],[4,5,6],[1,2,3]]
		expect(Utils.doubleMatrix(m)).toStrictEqual([[7,7,8,8,9,9],[7,7,8,8,9,9],[4,4,5,5,6,6],[4,4,5,5,6,6],[1,1,2,2,3,3],[1,1,2,2,3,3]])

	})
})
