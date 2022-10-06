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

class Fire implements TimerRenderer {
	readonly REMAINING_CHAR = Colors.foregroundColor('.', Xterm256.GREY_007)
	readonly HAND_CHAR = Colors.foregroundColor(UnicodeChars.BLOCK_FULL, Xterm256.PURPLE_4A)
	readonly SLICE_PERCENT = 0.01
	readonly RADIUS_MARGIN = 4

	pieChart = new SquarePieChart()

	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		return StringMatrix.createUniformMatrix(terminalDims.col, terminalDims.row, '.')
	}
}

export { Fire }
