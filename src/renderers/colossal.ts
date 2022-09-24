import { Xterm256 } from '../common/colors'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { XtermColorGradients } from '../common/xtermcolorgradients'
import { Rectangle } from '../common/Rectangle'
import { RenderUtils } from './renderutils'

class Colossal implements TimerRenderer {
	readonly doubleColorGradient = XtermColorGradients.doubleColorGradientOrExit(Xterm256.BLUE_1, Xterm256.BLUEVIOLET)
	readonly timeRemainingGradient = this.doubleColorGradient.concat(this.doubleColorGradient.reverse())
	readonly MAX_COLOSSAL_WIDTH = 50

	/**
	 * This renderer displays a large countdown timer in the Colossal Figlet font
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const horizPadding = 1
		const vertPadding = 1

		const gradientStart = details.iteration % this.timeRemainingGradient.length
		const gradient = this.timeRemainingGradient
			.slice(gradientStart)
			.concat(this.timeRemainingGradient.slice(0, gradientStart))

		const timeRemaining = Colossal.renderTimeRemainingFiglet(details)

		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemaining)
		timeRemainingMatrix.padLeft(horizPadding)
		timeRemainingMatrix.padRight(this.MAX_COLOSSAL_WIDTH - timeRemainingMatrix.cols() + horizPadding * 2)
		timeRemainingMatrix.addVertPadding(vertPadding, vertPadding)
		timeRemainingMatrix.setVerticalGradient(gradient)

		const boxBounds = new Rectangle(0, 0, timeRemainingMatrix.cols() - 1, timeRemainingMatrix.rows() - 1)
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
