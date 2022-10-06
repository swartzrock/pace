import { TimerRenderer } from './timerRenderer'
import { Colors, Xterm256 } from '../common/colors'
import { TimerDetails } from './timerDetails'
import { StringMatrix } from '../common/stringmatrix'
import { UnicodeChars } from '../common/unicodechars'
import { SquarePieChart } from '../common/squarepiechart'
import { TextBlocks } from '../common/textblocks'
import { Utils } from '../common/utils'
import { Point } from '../common/point'
import { FigletFonts, Fonts } from '../common/fonts'
import { XtermGradients } from '../common/xtermgradients'

class BigText implements TimerRenderer {
	readonly REMAINING_CHAR = Colors.foregroundColor('.', Xterm256.GREY_007)
	readonly HAND_CHAR = Colors.foregroundColor(UnicodeChars.BLOCK_FULL, Xterm256.PURPLE_4A)
	readonly SLICE_PERCENT = 0.01
	readonly RADIUS_MARGIN = 4

	pieChart = new SquarePieChart()

	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		const font = FigletFonts.ANSI_REGULAR

		const maxCols = terminalDims.col - 4
		const maxRows = terminalDims.row - 4

		const timeRemainingFiglet = TextBlocks.trimToContent(Fonts.render(font, details.timeRemainingText()))
		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemainingFiglet)

		while (timeRemainingMatrix.cols() * 2 < maxCols && timeRemainingMatrix.rows() * 2 < maxRows) {
			timeRemainingMatrix.matrix = timeRemainingMatrix.matrix.map((row) => Utils.double(row))
			timeRemainingMatrix.matrix = Utils.double(timeRemainingMatrix.matrix)
		}
		timeRemainingMatrix.setVerticalGradient(XtermGradients.SINGLE_COLOR_GRADIENTS.BLUE_1_TO_CYAN_1)

		return timeRemainingMatrix
	}
}

export { BigText }
