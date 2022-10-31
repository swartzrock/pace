import {Colors} from '../common/colors'
import {StringMatrix} from '../common/stringmatrix'
import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {UnicodeChars} from "../common/unicodechars";
import {Utils} from "../common/utils";
import {XtermGradients} from "../common/xtermgradients";

class Sine implements TimerRenderer {

	private readonly WAVE_LENGTH_COLS = 40;

	readonly GREEN_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.BLUE_1_TO_CYAN_1
	readonly YELLOW_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.YELLOW_3B_TO_LIGHTSTEELBLUE_1
	readonly RED_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.RED_3B_TO_MAGENTA_2A


	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {

		const progressBarLength = terminalDims.col - 8
		const barCompleteLen = Math.floor(details.percentDone() * progressBarLength)
		const graphHeight = terminalDims.row * 2 / 3
		const gradient = this.getGradient(details)

		const matrix = StringMatrix.createUniformMatrix(terminalDims.col, graphHeight)
		for (let col = 0 - 1; col < barCompleteLen; col++) {
			const sineValue = Math.sin(((col+details.iteration) / this.WAVE_LENGTH_COLS) * Math.PI * 2)
			this.plotSine(matrix, col, sineValue, gradient)
		}

		return matrix // StringMatrix.createUniformMatrix(terminalDims.col, terminalDims.row, ' ')
	}

	plotSine(matrix: StringMatrix, col: number, sineValue: number, gradient: number[]) {
		const originY = Utils.halfInt(matrix.rows())
		const vertMargin = 2
		const maxPositiveY = Utils.halfInt(matrix.rows() - vertMargin * 2)
		const waveRow = Math.floor(originY - (sineValue * maxPositiveY))

		const rows = Utils.createArrayRange(originY, waveRow)
		for (const row of rows) {
			const color = gradient[Math.floor(row / matrix.rows() * gradient.length)]
			const fillChar = Colors.foregroundColor(UnicodeChars.QUARTER_CIRCLE, color)
			matrix.setCell(fillChar, col, row)
		}
	}

	getGradient(details: TimerDetails): number[] {
		switch(true) {
			case (details.percentDone() > 0.9): return this.RED_GRADIENT
			case (details.percentDone() > 0.7): return this.YELLOW_GRADIENT
			default: return this.GREEN_GRADIENT
		}
	}

}

export { Sine }
