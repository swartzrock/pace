import { Colors, Xterm256 } from '../common/colors'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { StringUtils } from '../common/stringutils'

class Slant implements TimerRenderer {
	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		let timeRemaining = Slant.renderTimeRemainingFiglet(details)
		const timeRemainingLines = StringUtils.toLines(timeRemaining)
		const horizMargin = Math.floor((process.stdout.columns - timeRemainingLines[0].length) / 2)
		const vertMargin = 10
		timeRemaining = TextBlocks.addPadding(timeRemaining, horizMargin, vertMargin, ' ')
		const timeRemainingMatrix = StringMatrix.fromMultilineMonochromeString(timeRemaining)
		timeRemainingMatrix.replaceAll(' ', '_')
		timeRemainingMatrix.replaceAll('_', Colors.foregroundColor('_', Xterm256.CYAN_1))

		return timeRemainingMatrix
	}

	private static renderTimeRemainingFiglet(details: TimerDetails): string {
		const timeRemaining = details.timeRemainingText()
		const timeRemainingFont = FigletFonts.SLANT_RELIEF
		const timeRemainingFiglet = Fonts.render(timeRemainingFont, timeRemaining)
		return TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')
	}
}

export { Slant }
