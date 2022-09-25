import { describe, expect, test } from '@jest/globals'
import { Timer } from '../../src/commands/timer'

describe('timer', () => {
	test('timer details shows remaining seconds as floor', () => {
		const callbackIntervalMs = 100
		const verify = (i: number, total: number, seconds: number) => {
			const details = Timer.getTimerDetails(i, total, callbackIntervalMs)
			expect(details.remainingSeconds).toBe(seconds)
		}

		verify(1, 20, 2)
		verify(2, 20, 1)
		verify(3, 20, 1)
		verify(4, 20, 1)
		verify(5, 20, 1)
		verify(6, 20, 1)
		verify(7, 20, 1)
		verify(8, 20, 1)
		verify(9, 20, 1) // 1.1
		verify(10, 20, 1) // 1
		verify(11, 20, 1) // .9
		verify(12, 20, 0) // .8
		verify(13, 20, 0) // .7
		verify(14, 20, 0) // .6
		verify(15, 20, 0) // .5
		verify(16, 20, 0) // .4
		verify(17, 20, 0) // .3
		verify(18, 20, 0) // .2
		verify(19, 20, 0) // .1
		verify(20, 20, 0)
	})
})
