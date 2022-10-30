import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {StringMatrix} from '../common/stringmatrix'
import {TextBlocks} from '../common/textblocks'
import {Utils} from '../common/utils'
import {Point} from '../common/point'
import {FigletFonts, Fonts} from '../common/fonts'
import {XtermGradients} from '../common/xtermgradients'
import * as _ from 'lodash'

class BigText implements TimerRenderer {

	readonly FONT = FigletFonts.ANSI_REGULAR

	readonly GREEN_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.BLUE_1_TO_CYAN_1
	readonly YELLOW_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.YELLOW_3B_TO_LIGHTSTEELBLUE_1
	readonly RED_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.RED_3B_TO_MAGENTA_2A

	cachedDoubler: number | undefined
	cachedTerminalDims: Point | undefined

	render(details: TimerDetails, terminalDims: Point): StringMatrix {

		const timeRemainingFiglet = TextBlocks.trimToContent(Fonts.render(this.FONT, details.timeRemainingText()))
		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemainingFiglet)

		for (let i = 0; i < this.getDoubler(terminalDims); i++) {
			timeRemainingMatrix.matrix = timeRemainingMatrix.matrix.map((row) => Utils.double(row))
			timeRemainingMatrix.matrix = Utils.double(timeRemainingMatrix.matrix)
		}

		timeRemainingMatrix.setVerticalGradient(this.getGradient(details))

		return timeRemainingMatrix
	}

	getGradient(details: TimerDetails): number[] {
		switch(true) {
			case (details.percentDone() > 0.9): return this.RED_GRADIENT
			case (details.percentDone() > 0.7): return this.YELLOW_GRADIENT
			default: return this.GREEN_GRADIENT
		}
	}

	/**
	 * Return the number of times the matrix can be doubled and fit in the terminal
	 * @param terminalDims
	 */
	getDoubler(terminalDims: Point): number {

		if (this.cachedDoubler && this.cachedTerminalDims && _.isEqual(this.cachedTerminalDims, terminalDims)) {
			return this.cachedDoubler
		}

		const maxCols = terminalDims.col - 4
		const maxRows = terminalDims.row - 4

		const timeRemainingFiglet = TextBlocks.trimToContent(Fonts.render(this.FONT, "55:55"))
		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemainingFiglet)

		let doubler = 0
		while (timeRemainingMatrix.cols() * 2 < maxCols && timeRemainingMatrix.rows() * 2 < maxRows) {
			timeRemainingMatrix.matrix = timeRemainingMatrix.matrix.map((row) => Utils.double(row))
			timeRemainingMatrix.matrix = Utils.double(timeRemainingMatrix.matrix)
			doubler = doubler + 1
		}

		this.cachedDoubler = doubler
		this.cachedTerminalDims = terminalDims

		return doubler
	}


}

export { BigText }
