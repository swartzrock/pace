import { Colors, Xterm256 } from '../common/colors'
import { SquarePieChart, SquarePieChartDetails } from '../common/squarepiechart'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { RenderUtils } from './renderutils'
import { Point } from '../common/point'
import { Utils } from '../common/utils'
import { UnicodeChars } from '../common/unicodechars'
import { XtermColorGradients } from '../common/xtermcolorgradients'

class PieChart implements TimerRenderer {
	readonly CHART_FILL_CHAR = UnicodeChars.BLOCK_FULL
	readonly CHART_SHADOW_CHAR = UnicodeChars.SHADE_DARK

	readonly CHART_EMPTY_CHAR = 'z'
	readonly CHART_FILL_COLORS = [Xterm256.GREEN_1, Xterm256.GREENYELLOW, Xterm256.RED_1]
	readonly CHART_EMPTY_COLOR = Xterm256.GREY_007

	static TIME_REMAINING_GRADIENT: Xterm256[] = XtermColorGradients.doubleColorGradientOrExit(
		Xterm256.PURPLEA,
		Xterm256.PURPLEB
	)
		.slice(0, 7)
		.reverse()

	pieChart = new SquarePieChart()

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const centeredMonoChart: string = this.renderMonochromeCenteredPieChart(details.percentDone())
		const centeredMonoChartMatrix = StringMatrix.createFromMultilineMonoString(centeredMonoChart)

		const fillColor = RenderUtils.getGreenYellowRedColor(details.percentDone())
		const coloredFillChar = Colors.foregroundColor(this.CHART_FILL_CHAR, fillColor)
		const coloredEmptyChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)

		centeredMonoChartMatrix.replaceAll(this.CHART_FILL_CHAR, coloredFillChar)
		centeredMonoChartMatrix.replaceAll(this.CHART_EMPTY_CHAR, coloredEmptyChar)

		const timeRemaining = PieChart.renderTimeRemainingFiglet(details)

		const timeRemainingMatrixShadow = StringMatrix.createFromMultilineMonoString(timeRemaining)
		const shadowLoc = new Point(
			Utils.halfInt(centeredMonoChartMatrix.cols()) - Utils.halfInt(timeRemainingMatrixShadow.cols()) + 1,
			Utils.halfInt(centeredMonoChartMatrix.rows()) - Utils.halfInt(timeRemainingMatrixShadow.rows()) + 1
		)

		timeRemainingMatrixShadow.replaceAll('█', this.CHART_SHADOW_CHAR)
		centeredMonoChartMatrix.overlayAt(timeRemainingMatrixShadow, shadowLoc, undefined, true)

		const timeRemainingMatrix = StringMatrix.createFromMultilineMonoString(timeRemaining)
		timeRemainingMatrix.setVerticalGradient(PieChart.TIME_REMAINING_GRADIENT)
		centeredMonoChartMatrix.overlayCentered(timeRemainingMatrix)

		return centeredMonoChartMatrix
	}

	private renderMonochromeCenteredPieChart(percentDone: number): string {
		const radius = Math.floor(Math.min(process.stdout.rows, process.stdout.columns / 2) / 2) - 2
		const symbols: string[] = [this.CHART_FILL_CHAR, this.CHART_EMPTY_CHAR]
		const pieDetails: SquarePieChartDetails = {
			symbols: symbols,
			percentages: [percentDone, 1.0],
		}
		const squarePieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
		const pieChartTxt = TextBlocks.horizontallyDouble(squarePieChartTxt)
		return TextBlocks.centerHorizontallyOnScreen(pieChartTxt)
	}

	private static renderTimeRemainingFiglet(details: TimerDetails): string {
		const timeRemaining = details.timeRemainingText()
		const timeRemainingFont = FigletFonts.ANSI_REGULAR
		const timeRemainingFiglet = Fonts.render(timeRemainingFont, timeRemaining)
		return TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')
	}
}

export { PieChart }
