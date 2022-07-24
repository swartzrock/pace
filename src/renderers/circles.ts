import { Colors, Xterm256 } from '../common/colors'

import { TimerDetails, TimerRenderer } from './timer-renderer'
import { StringUtils } from '../common/stringutils'
import { StringMatrix } from '../common/stringmatrix'
import { XtermColorGradients } from '../common/xtermcolorgradients'

class Circles implements TimerRenderer {
	readonly CIRCLE_COMPLETE_CHAR = '\u2588'
	readonly CIRCLE_INCOMPLETE_CHAR = '\u2591'
	readonly RIGHT_MARGIN = 2

	readonly QUARTER_CIRCLE = '•'
	readonly HALF_CIRCLE = '●'
	readonly FULL_CIRCLE = '⬤'

	count = 0

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const rightMargin = 4
		const cols = process.stdout.columns - rightMargin
		const rows = Math.round((process.stdout.rows * 2) / 3)
		const total = cols * rows

		const numFilled = Math.round(details.percentDone * total)
		const text =
			StringUtils.fillString(this.CIRCLE_COMPLETE_CHAR, numFilled) +
			StringUtils.fillString(this.CIRCLE_INCOMPLETE_CHAR, total - numFilled) +
			`- ${++this.count}`

		const matrix = new StringMatrix(StringUtils.newlineWrapToScreen(text, rightMargin))
		matrix.replaceAll(this.CIRCLE_COMPLETE_CHAR, Colors.foregroundColor(this.HALF_CIRCLE, Xterm256.GREEN_1))
		matrix.replaceAll(this.CIRCLE_INCOMPLETE_CHAR, Colors.foregroundColor(this.HALF_CIRCLE, Xterm256.GREY_003))

		return matrix
		//
		//
		// const greenGradient = XtermColorGradients.singleColorGradientOrExit(Xterm256.GREY_000, Xterm256.GREEN_1)
		//
		// const greenCircle = Colors.foregroundColor(this.HALF_CIRCLE, Xterm256.GREEN_1)
		// const filled =
		//
		// // const emptyCircle = Colors.foregroundColor(this.HALF_CIRCLE, Xterm256.GREY_003)
		// const empties =
		//
		// const text = filled + empties + '\n'
		// const result = new StringMatrix(StringUtils.newlineWrapToScreen(text, rightMargin))
		// console.log(result.matrix)
		//
		// return new StringMatrix('foof')
	}
}

export { Circles }
