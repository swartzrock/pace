import {Colors, Xterm256} from '../common/colors'

import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {StringUtils} from '../common/stringutils'
import {StringMatrix} from '../common/stringmatrix'
import {Point} from '../common/point'
import {Rectangle} from '../common/rectangle'
import {UnicodeChars} from "../common/unicodechars";

class Bar implements TimerRenderer {
	readonly BAR_COMPLETE_CHAR = UnicodeChars.BLOCK_FULL
	readonly BAR_INCOMPLETE_CHAR = UnicodeChars.SHADE_DARK
	readonly RIGHT_MARGIN = 2
	readonly PADDING = new Rectangle(2, 4, 2, 4)

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		const fgColor: Xterm256 = TimerRenderer.getGreenYellowRedColor(details.percentDone())//  this.fgColor(details.percentDone())
		const colorBarComplete = Colors.foregroundColor(this.BAR_COMPLETE_CHAR, fgColor)
		const colorBarIncomplete = Colors.foregroundColor(this.BAR_INCOMPLETE_CHAR, Xterm256.GREY_030)

		const matrix = StringMatrix.createFromMultilineMonoString(this.renderMonoProgressBar(details, terminalDims))
		matrix.replaceAll(this.BAR_COMPLETE_CHAR, colorBarComplete)
		matrix.replaceAll(this.BAR_INCOMPLETE_CHAR, colorBarIncomplete)
		matrix.pad(this.PADDING)
		return matrix
	}

	private renderMonoProgressBar(details: TimerDetails, terminalDims: Point): string {
		const progressBarDetailLength = Bar.renderBar('', '', '000:00', '99.9').length
		const progressBarLength = terminalDims.col - progressBarDetailLength - this.RIGHT_MARGIN

		const barCompleteLen = Math.round(details.percentDone() * progressBarLength)
		const barEmptyLen = progressBarLength - barCompleteLen

		const barCompleteStr = StringUtils.fillString(this.BAR_COMPLETE_CHAR, barCompleteLen)
		const barIncompleteStr = StringUtils.fillString(this.BAR_INCOMPLETE_CHAR, barEmptyLen)

		const timeElapsed = this.renderTimeElapsed(details)
		const timeRemaining = details.timeRemainingText()

		return Bar.renderBar(barCompleteStr, barIncompleteStr, timeElapsed, timeRemaining)
	}

	private static renderBar(
		barComplete: string,
		barIncomplete: string,
		timeElapsed: string,
		timeRemaining: string
	): string {
		return `${timeElapsed} | ${barComplete}${barIncomplete} | ${timeRemaining} `
	}

	private renderTimeElapsed(details: TimerDetails): string {
		const elapsedMinutes: number = Math.floor(details.elapsedSeconds / 60)
		const elapsedSecondsInMinute: number = details.elapsedSeconds - elapsedMinutes * 60
		return `${elapsedMinutes}:` + `${elapsedSecondsInMinute}`.padStart(2, '0')
	}

}

export { Bar }
