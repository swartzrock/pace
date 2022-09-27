import { Colors, Xterm256 } from '../common/colors'
import { SquarePieChart, SquarePieChartDetails } from '../common/squarepiechart'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { RenderUtils } from './renderutils'
import { Point } from '../common/point'
import { UnicodeChars } from '../common/unicodechars'
import { XtermGradients } from '../common/xtermgradients'

class PieChart implements TimerRenderer {
	readonly CHART_FILL_CHAR = UnicodeChars.BLOCK_FULL
	readonly CHART_SHADOW_CHAR = UnicodeChars.SHADE_DARK

	readonly CHART_EMPTY_CHAR = 'z'
	readonly CHART_EMPTY_COLOR = Xterm256.GREY_007

	static TIME_REMAINING_GRADIENT: Xterm256[] = XtermGradients.DOUBLE_COLOR_GRADIENTS.PURPLEB_TO_PURPLEA.slice(
		0,
		7
	).reverse()

	pieChart = new SquarePieChart()

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		const fillColor = RenderUtils.getGreenYellowRedColor(details.percentDone())
		const coloredFillChar = Colors.foregroundColor(this.CHART_FILL_CHAR, fillColor)
		const coloredEmptyChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)

		// render the main pie chart
		const centeredMonoChart: string = this.renderMonochromeCenteredPieChart(details.percentDone(), terminalDims)
		const centeredMonoChartMatrix = StringMatrix.createFromMultilineMonoString(centeredMonoChart)
		centeredMonoChartMatrix.replaceAll(this.CHART_FILL_CHAR, coloredFillChar)
		centeredMonoChartMatrix.replaceAll(this.CHART_EMPTY_CHAR, coloredEmptyChar)

		const timeRemainingFiglet = Fonts.render(FigletFonts.ANSI_REGULAR, details.timeRemainingText())
		const timeRemaining = TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')

		// render the time-remaining shadow
		const timeRemainingMatrixShadow = StringMatrix.createFromMultilineMonoString(timeRemaining)
		const shadowOffset = new Point(1, 1)
		timeRemainingMatrixShadow.replaceAll('█', this.CHART_SHADOW_CHAR)
		centeredMonoChartMatrix.overlayCentered(timeRemainingMatrixShadow, undefined, true, shadowOffset)

		// render the time-remaining text
		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemaining)
		timeRemainingMatrix.setVerticalGradient(PieChart.TIME_REMAINING_GRADIENT)
		centeredMonoChartMatrix.overlayCentered(timeRemainingMatrix)

		return centeredMonoChartMatrix
	}

	private renderMonochromeCenteredPieChart(percentDone: number, terminalDims: Point): string {
		const radius = Math.floor(Math.min(process.stdout.rows, terminalDims.col / 2) / 2) - 2
		const symbols: string[] = [this.CHART_FILL_CHAR, this.CHART_EMPTY_CHAR]
		const pieDetails: SquarePieChartDetails = {
			symbols: symbols,
			percentages: [percentDone, 1.0],
		}
		const squarePieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
		const pieChartTxt = TextBlocks.horizontallyDouble(squarePieChartTxt)
		return TextBlocks.centerHorizontallyOnScreen(pieChartTxt)
	}
}

export { PieChart }
