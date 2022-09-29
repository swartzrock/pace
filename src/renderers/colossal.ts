import { StringMatrix } from '../common/stringmatrix'
import { TimerRenderer } from './timerRenderer'
import { TimerDetails } from './timerDetails'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { XtermGradients } from '../common/xtermgradients'
import { Rectangle } from '../common/rectangle'
import { Utils } from '../common/utils'
import { Point } from '../common/point'

class Colossal implements TimerRenderer {
	readonly timeRemainingGradient = Utils.concatReversed(XtermGradients.DOUBLE_COLOR_GRADIENTS.BLUEVIOLET_TO_BLUE_1)
	readonly MAX_COLOSSAL_WIDTH = 50

	/**
	 * This renderer displays a large countdown timer in the Colossal Figlet font
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(details: TimerDetails, terminalDims: Point): StringMatrix {
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
		const boxColor = TimerRenderer.getGreenYellowRedColor(details.percentDone())
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
