import { describe, expect, test } from '@jest/globals'
import { Colossal } from '../../src/renderers/colossal'
import { TimerDetails } from '../../src/renderers/timer-renderer'
import { Loggy } from '../../src/common/loggy'

describe('colossal', () => {
	test('centered', () => {
		const details = new TimerDetails(10, 100, 2, 3355)
		const matrix = new Colossal().render(details)

		// Make sure there's a line of blank space inside the border
		expect(matrix.matrix[1][1]).toBe(' ')
		expect(matrix.matrix[1][2]).toBe(' ')
		expect(matrix.matrix[2][0]).not.toBe(' ')
		expect(matrix.matrix[2][1]).toBe(' ')
		expect(matrix.matrix[2][2]).not.toBe(' ')

		Loggy.raw(matrix)
	})
})
