import {Colors, Xterm256} from '../common/colors'
import {StringMatrix} from '../common/stringmatrix'
import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {UnicodeChars} from "../common/unicodechars";
import {Utils} from "../common/utils";
import {XtermGradients} from "../common/xtermgradients";
import {FigletFonts, Fonts} from "../common/fonts";
import {TextBlocks} from "../common/textblocks";

class Sine implements TimerRenderer {

	private readonly WAVE_LENGTH_COLS = 40
	private readonly MIN_COLUMN = 5 // the sine wave looks funny with 1 column, so start with 5

	readonly GREEN_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.BLUE_1_TO_CYAN_1
	readonly YELLOW_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.YELLOW_3B_TO_LIGHTSTEELBLUE_1
	readonly RED_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.RED_3B_TO_MAGENTA_2A
	readonly TIME_REMAINING_GRADIENT: Xterm256[] = Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.BLUE_1_TO_CYAN_1)
	readonly SHADOW_CHAR = Colors.foregroundColor(UnicodeChars.FULL_CIRCLE, Xterm256.GREY_000)


	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {

		const progressBarLength = terminalDims.col - 8
		const barCompleteLen = Math.max(this.MIN_COLUMN, Math.floor(details.percentDone() * progressBarLength))
		const graphHeight = terminalDims.row / 2
		const gradient = this.getGradient(details)

		const matrix = StringMatrix.createUniformMatrix(terminalDims.col, graphHeight)
		for (let col = 0 - 1; col < barCompleteLen; col++) {
			const sineValue = Math.sin(((col+details.iteration) / this.WAVE_LENGTH_COLS) * Math.PI * 2)
			this.plotSine(matrix, col, sineValue, gradient)
		}

		const timeRemainingFiglet = Fonts.render(FigletFonts.ANSI_REGULAR, details.timeRemainingText())
		const timeRemaining = TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')

		// render the time-remaining shadow
		const timeRemainingMatrixShadow = StringMatrix.createFromMultilineMonoString(timeRemaining)
		timeRemainingMatrixShadow.double()
		const shadowOffset = new Point(1, 1)
		timeRemainingMatrixShadow.replaceAll(UnicodeChars.BLOCK_FULL, this.SHADOW_CHAR)
		matrix.overlayCentered(timeRemainingMatrixShadow, undefined, true, shadowOffset)

		// render the time-remaining text
		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemaining)
		timeRemainingMatrix.double()
		timeRemainingMatrix.replaceAll(UnicodeChars.BLOCK_FULL, UnicodeChars.HALF_CIRCLE)
		timeRemainingMatrix.setVerticalGradient(this.TIME_REMAINING_GRADIENT)
		matrix.overlayCentered(timeRemainingMatrix)


		return matrix
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
