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
	readonly MAX_COLOSSAL_WIDTH = 60 // 48

	/**
	 * This renderer displays a large countdown timer in the Colossal Figlet font
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
		const maxRowWidth = TextBlocks.maxRowWidth(timeRemaining)

		const horizPadding = 4
		const vertPadding = 2

		const padding = new Rectangle(
			horizPadding,
			vertPadding,
			this.MAX_COLOSSAL_WIDTH - maxRowWidth + horizPadding,
			vertPadding
		)
		timeRemaining = TextBlocks.setAllPadding(timeRemaining, padding, ' ')

		const timeRemainingMatrix = StringMatrix.fromMultilineMonochromeString(timeRemaining)
		timeRemainingMatrix.setVerticalGradient(gradient)

		const boxOffset = 1
		const boxBounds = new Rectangle(
			horizPadding - boxOffset - 1,
			vertPadding - boxOffset - 1,
			this.MAX_COLOSSAL_WIDTH - horizPadding - boxOffset,
			rows + vertPadding - boxOffset
		)
		const boxColor = RenderUtils.getGreenYellowRedColor(details.percentDone())
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
