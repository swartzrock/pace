import { describe, expect, test } from '@jest/globals'
import { StringMatrix } from '../../src/common/stringmatrix'
import { TestUtils } from '../../src/common/testutils'
import { Rectangle } from '../../src/common/Rectangle'
import { Colors, Xterm256 } from '../../src/common/colors'
import { StringUtils } from '../../src/common/stringutils'
import { Loggy } from '../../src/common/loggy'

describe('stringmatrix', () => {
	test('basic rows and cols', () => {
		const matrix = StringMatrix.createFromMultilineMonoString(
			'         hello\n           how\n           are\n         you22  '
		)
		expect(matrix.cols()).toBe(14)
		expect(matrix.rows()).toBe(4)
	})

	test('setWidth', () => {
		const expanded = StringMatrix.createUniformMatrix(4, 20, 's')
		expect(expanded.rowString(0)).toBe('ssss')
		expanded.setWidthCentered(10, 'w')
		expect(expanded.rowString(0)).toBe('wwwsssswww')
	})

	test('addVertPadding', () => {
		const padded = StringMatrix.createUniformMatrix(4, 4, 's')
		expect(padded.rowString(0)).toBe('ssss')
		padded.addVertPadding(2, 0, 'p')
		expect(padded.rowString(0)).toBe('pppp')
		expect(padded.rowString(1)).toBe('pppp')
		expect(padded.rowString(2)).toBe('ssss')
	})

	test('addDoubleLineBox', () => {
		const width = 10
		const rightCol = width - 1
		const height = 6
		const bottomRow = height - 1
		const boxColor = Xterm256.GREEN_1
		const boxed = StringMatrix.createUniformMatrix(width, height, 's')
		const boxBounds = new Rectangle(1, 1, rightCol - 1, bottomRow - 1)
		boxed.addDoubleLineBox(boxBounds, boxColor)
		Loggy.raw(boxed)

		const tlPipe = Colors.foregroundColor('╔', boxColor)
		const trPipe = Colors.foregroundColor('╗', boxColor)
		const horizPipe = Colors.foregroundColor('═', boxColor)
		const vertPipe = Colors.foregroundColor('║', boxColor)

		expect(boxed.rowString(0)).toBe('ssssssssss')
		expect(boxed.rowString(1)).toBe(`s${tlPipe}${StringUtils.fillString(horizPipe, 6)}${trPipe}s`)
		expect(boxed.rowString(2)).toBe(`s${vertPipe}ssssss${vertPipe}s`)
		expect(boxed.rowString(3)).toBe(`s${vertPipe}ssssss${vertPipe}s`)
	})

	test('fitTo', () => {
		const padded = StringMatrix.createUniformMatrix(4, 4, 's')
		padded.fitTo(8, 8, 'f')

		expect(padded.rowString(0)).toBe('ffffffff')
		expect(padded.rowString(0)).toBe('ffffffff')
		expect(padded.rowString(1)).toBe('ffffffff')
		expect(padded.rowString(2)).toBe('ffssssff')
		expect(padded.rowString(5)).toBe('ffssssff')
		expect(padded.rowString(6)).toBe('ffffffff')
		expect(padded.rowString(7)).toBe('ffffffff')
	})

	test('verify createUniformMatrix works with color strings', () => {
		const fillChar = Colors.foregroundColor('\u2588', Xterm256.GREEN_1)
		const matrix = StringMatrix.createUniformMatrix(180, 30, fillChar)
		expect(matrix.cols()).toBe(180)
		expect(matrix.rows()).toBe(30)
	})

	test('setHorizontallyCenteredMonochromeString', () => {
		const matrix = StringMatrix.createUniformMatrix(20, 10, '.')
		matrix.setHorizontallyCenteredMonochromeString('Hello', 2)
		expect(matrix.rowString(2)).toBe('.......Hello........')
	})
})
