import { Colors, Xterm256 } from '../common/colors'

import { TimerRenderer } from './timerRenderer'
import { TimerDetails } from './timerDetails'
import { StringUtils } from '../common/stringutils'
import { StringMatrix } from '../common/stringmatrix'
import { Rectangle } from '../common/rectangle'
import { Point } from '../common/point'
import { UnicodeChars } from '../common/unicodechars'

class Dots implements TimerRenderer {
	readonly CIRCLE_COMPLETE_CHAR = UnicodeChars.BLOCK_FULL
	readonly CIRCLE_INCOMPLETE_CHAR = UnicodeChars.SHADE_MEDIUM

	readonly CHART_EMPTY_COLOR = Xterm256.GREY_003

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		const boxMargin = 1
		const horizMargin = 4 // include room for the box
		const vertMargin = 3 // include room for the box

		const cols = terminalDims.col - horizMargin * 2 - boxMargin * 2

		const maxRows = terminalDims.row / 2 - vertMargin * 2 - boxMargin * 2
		let rows = Math.floor(details.totalIterations / cols)
		if (rows * cols < details.totalIterations) rows++
		rows = Math.floor(Math.min(rows, maxRows))

		const total = rows * cols

		const numFilled = Math.round(details.percentDone() * total)
		const text =
			StringUtils.fillString(this.CIRCLE_COMPLETE_CHAR, numFilled) +
			StringUtils.fillString(this.CIRCLE_INCOMPLETE_CHAR, total - numFilled)

		const newlineText = StringUtils.newlineWrapWithMargins(
			text,
			cols,
			vertMargin,
			horizMargin,
			vertMargin,
			horizMargin,
			' '
		)
		const stringMatrix = StringMatrix.createFromMultilineMonoString(newlineText)
		const fillColor = TimerRenderer.getGreenYellowRedColor(details.percentDone())
		stringMatrix.replaceAll(this.CIRCLE_COMPLETE_CHAR, Colors.foregroundColor(UnicodeChars.HALF_CIRCLE, fillColor))
		stringMatrix.replaceAll(
			this.CIRCLE_INCOMPLETE_CHAR,
			Colors.foregroundColor(UnicodeChars.HALF_CIRCLE, this.CHART_EMPTY_COLOR)
		)

		const boxRect = new Rectangle(
			horizMargin - 2,
			vertMargin - 2,
			stringMatrix.cols() - horizMargin + 1,
			stringMatrix.rows() - vertMargin + 1
		)

		stringMatrix.addDoubleLineBox(boxRect, fillColor)

		const timeRemainingText = ` ${details.timeRemainingText()} remaining `
		stringMatrix.setHorizontallyCenteredMonochromeString(timeRemainingText, vertMargin - 2)

		return stringMatrix
	}
}

export { Dots }
