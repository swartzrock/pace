import { Colors, Xterm256 } from '../common/colors'
import { SquarePieChart, SquarePieChartDetails } from '../common/squarepiechart'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'
import { RenderUtils } from './renderutils'

class PieChart implements TimerRenderer {
	readonly CHART_FILL_CHAR = '\u2588'
	readonly CHART_EMPTY_CHAR = 'z'
	readonly CHART_FILL_COLORS = [Xterm256.GREEN_1, Xterm256.GREENYELLOW, Xterm256.RED_1]
	readonly CHART_EMPTY_COLOR = Xterm256.GREY_007

	static MONOCHROME_GRADIENT: Xterm256[] = [
		Xterm256.GREY_058,
		Xterm256.GREY_062,
		Xterm256.GREY_066,
		Xterm256.GREY_070,
		Xterm256.GREY_074,
		Xterm256.GREY_078,
		Xterm256.GREY_082,
		Xterm256.GREY_085,
		Xterm256.GREY_089,
		Xterm256.GREY_093,
		Xterm256.GREY_100,
	]
	pieChart = new SquarePieChart()

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const centeredMonoChart: string = this.renderMonochromeCenteredPieChart(details.percentDone)
		const centeredMonoChartMatrix = StringMatrix.fromMultilineMonochromeString(centeredMonoChart)

		const fillColor = RenderUtils.getGreenYellowRedColor(details.percentDone)
		const coloredFillChar = Colors.foregroundColor(this.CHART_FILL_CHAR, fillColor)
		const coloredEmptyChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)

		// centeredMonoChartMatrix.setVerticalGradientDithered(this.timeRemainingGradient, this.CHART_FILL_CHAR)
		centeredMonoChartMatrix.replaceAll(this.CHART_FILL_CHAR, coloredFillChar)
		centeredMonoChartMatrix.replaceAll(this.CHART_EMPTY_CHAR, coloredEmptyChar)

		const timeRemaining = PieChart.renderTimeRemainingFiglet(details)
		const timeRemainingMatrix = StringMatrix.fromMultilineMonochromeString(timeRemaining)

		timeRemainingMatrix.setVerticalGradient(PieChart.MONOCHROME_GRADIENT)
		centeredMonoChartMatrix.overlayCentered(timeRemainingMatrix, ' ')

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
