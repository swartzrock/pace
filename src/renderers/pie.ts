import { Colors, Xterm256 } from '../common/colors'
import { SquarePieChart, SquarePieChartDetails } from '../common/squarepiechart'
import { StringMatrix } from '../common/stringmatrix'
import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'
import { TextBlocks } from '../common/textblocks'

class PieChart implements TimerRenderer {
	readonly CHART_FILL_CHAR = '\u2588'
	readonly CHART_EMPTY_CHAR = 'z'
	readonly CHART_FILL_COLORS = [Xterm256.GREEN_1, Xterm256.GREENYELLOW, Xterm256.RED_1]
	readonly CHART_EMPTY_COLOR = Xterm256.GREY_007

	readonly timeRemainingGradient: Xterm256[] = [
		Xterm256.CYAN_1,
		Xterm256.CYAN_2,
		Xterm256.MEDIUMSPRINGGREEN,
		Xterm256.SPRINGGREEN_1,
		Xterm256.SPRINGGREEN_2A,
		Xterm256.GREEN_1,
	]

	pieChart = new SquarePieChart()

	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 */
	render(details: TimerDetails): StringMatrix {
		const centeredMonoChart: string = this.renderMonochromeCenteredPieChart(details.percentDone)
		const centeredMonoChartMatrix = StringMatrix.fromMultilineMonochromeString(centeredMonoChart)

		const coloredFillChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.calcFillColor(details.percentDone))
		const coloredEmptyChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)

		// centeredMonoChartMatrix.setVerticalGradientDithered(this.timeRemainingGradient, this.CHART_FILL_CHAR)
		centeredMonoChartMatrix.replaceAll(this.CHART_FILL_CHAR, coloredFillChar)
		centeredMonoChartMatrix.replaceAll(this.CHART_EMPTY_CHAR, coloredEmptyChar)

		const timeRemaining = this.renderTimeRemainingColoredFiglet(details)
		const timeRemainingMatrix = StringMatrix.fromMultilineMonochromeString(timeRemaining)
		timeRemainingMatrix.setVerticalGradient(this.timeRemainingGradient)
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

	private renderTimeRemainingColoredFiglet(details: TimerDetails): string {
		const remainingMinutes: number = Math.floor(details.remainingSeconds / 60)
		const remainingSecondsInMinute: number = details.remainingSeconds - remainingMinutes * 60
		const timeRemaining = `${remainingMinutes}:` + `${remainingSecondsInMinute}`.padStart(2, '0')

		const timeRemainingFont = FigletFonts.COLOSSAL
		const timeRemainingFiglet = Fonts.render(timeRemainingFont, timeRemaining)
		return TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')
		// return Colors.foregroundColorVerticalGradient(timeRemainingPadded, this.timeRemainingGradient)
	}

	private calcFillColor(percentDone: number): Xterm256 {
		let index = 0
		if (percentDone > 0.9) {
			index = 2
		} else if (percentDone > 0.7) {
			index = 1
		}
		return this.CHART_FILL_COLORS[index]
	}
}

export { PieChart }
