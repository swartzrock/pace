import { Colors, Xterm256 } from '../common/colors'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { Rectangle } from '../common/Rectangle'

class Slant implements TimerRenderer {
	private static TIME_REMAINING_FONT = FigletFonts.SLANT_RELIEF
	private static MAX_SLANT_WIDTH = 87 // width of '55:55' in Slant font
	private static VERTICAL_PADDING = 10

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const timeRemaining = Slant.renderTimeRemainingFiglet(details)
		const maxRowWidth = TextBlocks.maxRowWidth(timeRemaining)
		const terminalWidth = process.stdout.columns

		const leftPadding = Math.floor((terminalWidth - Slant.MAX_SLANT_WIDTH) / 2)
		const rightPadding = terminalWidth - leftPadding - maxRowWidth
		const paddings = new Rectangle(leftPadding, Slant.VERTICAL_PADDING, rightPadding, Slant.VERTICAL_PADDING)

		const paddedTimeRemaining = TextBlocks.addAllPadding(timeRemaining, paddings, ' ')

		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(paddedTimeRemaining)
		timeRemainingMatrix.replaceAll(' ', '_')
		timeRemainingMatrix.replaceAll('_', Colors.foregroundColor('_', Xterm256.CYAN_1))

		return timeRemainingMatrix
	}

	private static renderTimeRemainingFiglet(details: TimerDetails): string {
		const timeRemaining = details.timeRemainingText()
		const timeRemainingFiglet = Fonts.render(this.TIME_REMAINING_FONT, timeRemaining)
		return TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')
	}
}

export { Slant }
