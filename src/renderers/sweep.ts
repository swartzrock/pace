import { TimerRenderer } from './timerRenderer'
import { Colors, Xterm256 } from '../common/colors'
import { TimerDetails } from './timerDetails'
import { StringMatrix } from '../common/stringmatrix'
import { UnicodeChars } from '../common/unicodechars'
import { SquarePieChart, SquarePieChartDetails } from '../common/squarepiechart'
import { TextBlocks } from '../common/textblocks'
import { Utils } from '../common/utils'
import { Point } from '../common/point'
import { FigletFonts, Fonts } from '../common/fonts'

class Sweep implements TimerRenderer {
	readonly REMAINING_CHAR = Colors.foregroundColor('.', Xterm256.GREY_007)
	readonly HAND_CHAR = Colors.foregroundColor(UnicodeChars.BLOCK_FULL, Xterm256.PURPLE_4A)
	readonly SLICE_PERCENT = 0.01
	readonly RADIUS_MARGIN = 4

	pieChart = new SquarePieChart()

	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		const radius = Utils.halfInt(Math.min(terminalDims.row, terminalDims.col / 2)) - this.RADIUS_MARGIN

		const pieDetails: SquarePieChartDetails = {
			symbols: ['a', 'b'],
			percentages: [1 - details.percentDone(), this.SLICE_PERCENT],
		}
		const squarePieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
		const pieChartTxt = TextBlocks.horizontallyDouble(squarePieChartTxt)
		const matrix = StringMatrix.createFromMultilineMonoString(pieChartTxt)

		matrix.replaceAll('a', this.REMAINING_CHAR)
		matrix.replaceAll('b', this.HAND_CHAR)

		const timeRemainingFiglet = Fonts.render(FigletFonts.ANSI_REGULAR, details.timeRemainingText())
		const timeRemaining = TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')
		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemaining)
		const timeRemainingChar = Colors.foregroundColor(
			UnicodeChars.BLOCK_FULL,
			TimerRenderer.getGreenYellowRedColor(details.percentDone())
		)
		timeRemainingMatrix.replaceAll(UnicodeChars.BLOCK_FULL, timeRemainingChar)
		matrix.overlayCentered(timeRemainingMatrix, 'x')

		return matrix
	}
}

export { Sweep }
