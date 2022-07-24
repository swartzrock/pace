import { Colors, Xterm256 } from '../common/colors'

import { TimerDetails, TimerRenderer } from './timer-renderer'
import { StringUtils } from '../common/stringutils'
import { StringMatrix } from '../common/stringmatrix'

class Circles implements TimerRenderer {
	readonly CIRCLE_COMPLETE_CHAR = '\u2588'
	readonly CIRCLE_INCOMPLETE_CHAR = '\u2591'

	readonly CHART_EMPTY_COLOR = Xterm256.GREY_003
	readonly CHART_FILL_COLORS = [Xterm256.GREEN_1, Xterm256.GREENYELLOW, Xterm256.RED_1]

	readonly QUARTER_CIRCLE = '•'
	readonly HALF_CIRCLE = '●'
	readonly FULL_CIRCLE = '⬤'

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const horizMargin = 2
		const cols = process.stdout.columns - horizMargin * 2
		let rows = Math.floor(details.totalIterations / cols)
		if (rows * cols < details.totalIterations) rows++

		const total = details.totalIterations

		const numFilled = Math.round(details.percentDone * total)
		const text =
			StringUtils.fillString(this.CIRCLE_COMPLETE_CHAR, numFilled) +
			StringUtils.fillString(this.CIRCLE_INCOMPLETE_CHAR, total - numFilled)

		const newlineText = StringUtils.newlineWrapWithMargins(text, cols, 1, horizMargin, 0, horizMargin, ' ')
		const matrix = StringMatrix.fromMultilineMonochromeString(newlineText)
		matrix.replaceAll(
			this.CIRCLE_COMPLETE_CHAR,
			Colors.foregroundColor(this.HALF_CIRCLE, this.calcFillColor(details.percentDone))
		)
		matrix.replaceAll(this.CIRCLE_INCOMPLETE_CHAR, Colors.foregroundColor(this.HALF_CIRCLE, this.CHART_EMPTY_COLOR))

		return matrix
	}

	private calcFillColor(percentDone: number): Xterm256 {
		let index = 0
		if (percentDone > 0.9) {
			index = 2
		} else if (percentDone > 0.7) {
			index = 1
		}
		return this.CHART_FILL_COLORS[index]
	}
}

export { Circles }
