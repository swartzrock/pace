import { Xterm256 } from '../common/colors'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { XtermColorGradients } from '../common/xtermcolorgradients'
import { StringUtils } from '../common/stringutils'
import { Rectangle } from '../common/Rectangle'
import { RenderUtils } from './renderutils'

class Colossal implements TimerRenderer {
	readonly doubleColorGradient = XtermColorGradients.doubleColorGradientOrExit(Xterm256.BLUE_1, Xterm256.BLUEVIOLET)
	readonly timeRemainingGradient = this.doubleColorGradient.concat(this.doubleColorGradient.reverse())

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const gradientStart = details.iteration % this.timeRemainingGradient.length
		const gradient = this.timeRemainingGradient
			.slice(gradientStart)
			.concat(this.timeRemainingGradient.slice(0, gradientStart))

		let timeRemaining = Colossal.renderTimeRemainingFiglet(details)
		const timeRemainingLines = timeRemaining.split(StringUtils.NEWLINE)
		const rows = timeRemainingLines.length
		const cols = timeRemainingLines[0].length
		const horizMargin = 2
		const vertMargin = 2
		timeRemaining = TextBlocks.setPadding(timeRemaining, horizMargin, vertMargin, ' ')

		const timeRemainingMatrix = StringMatrix.fromMultilineMonochromeString(timeRemaining)
		timeRemainingMatrix.setVerticalGradient(gradient)

		const boxOffset = 1
		const boxBounds = new Rectangle(
			horizMargin - boxOffset - 1,
			vertMargin - boxOffset - 1,
			cols + horizMargin - boxOffset,
			rows + vertMargin - boxOffset
		)
		const boxColor = RenderUtils.getGreenYellowRedColor(details.percentDone)
		timeRemainingMatrix.addDoubleLineBox(boxBounds, boxColor)

		return timeRemainingMatrix
	}

	private static renderTimeRemainingFiglet(details: TimerDetails): string {
		const timeRemaining = details.timeRemainingText()
		const timeRemainingFont = FigletFonts.COLOSSAL
		const timeRemainingFiglet = Fonts.render(timeRemainingFont, timeRemaining)
		return TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')
	}
}

export { Colossal }
