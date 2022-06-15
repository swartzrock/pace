import { Colors, Xterm256 } from '../common/colors'
import { StringUtils } from '../common/stringutils'
import { SquarePieChart, SquarePieChartDetails } from '../common/squarepiechart'

import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'

class PieChart3 implements TimerRenderer {
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

	renderToColorStringMatrix(details: TimerDetails): string[][] {
		const centeredMonoChart: string = this.renderMonochromeCenteredPieChart(details.percentDone)
		const matrix: string[][] = StringUtils.TextBlocks.toString2dArray(centeredMonoChart)

		// const coloredFillChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.calcFillColor(details.percentDone))
		const coloredEmptyChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)

		StringUtils.StringMatrix.setVerticalGradientDithered(matrix, this.timeRemainingGradient, this.CHART_FILL_CHAR)
		// StringUtils.StringMatrix.replaceAll(matrix, this.CHART_FILL_CHAR, coloredFillChar)
		StringUtils.StringMatrix.replaceAll(matrix, this.CHART_EMPTY_CHAR, coloredEmptyChar)

		const timeRemaining = this.renderTimeRemainingColoredFiglet(details)
		const timeRemainingMatrix = StringUtils.TextBlocks.toString2dArray(timeRemaining)
		StringUtils.StringMatrix.setVerticalGradient(timeRemainingMatrix, this.timeRemainingGradient)

		StringUtils.StringMatrix.addCenteredForeground(matrix, timeRemainingMatrix)

		return matrix
	}

	/**
	 * Entrypoint - renders this pie chart to the console
	 * @param details
	 */
	render(details: TimerDetails): void {
		const matrix = this.renderToColorStringMatrix(details)
		console.log(StringUtils.StringMatrix.toString(matrix))

		/*
		let centeredPieChart = this.renderMonochromeCenteredPieChart(details.percentDone)

		const timeRemainingFiglet = this.renderTimeRemainingColoredFiglet(details)
		centeredPieChart = StringUtils.centerTextBlockInTextBlock(timeRemainingFiglet, centeredPieChart)

		// Note - pie chart colorization must be done after the time has been rendered onto it
		centeredPieChart = centeredPieChart.replaceAll(
			this.CHART_FILL_CHAR,
			Colors.foregroundColor(this.CHART_FILL_CHAR, this.calcFillColor(details.percentDone))
		)
		centeredPieChart = centeredPieChart.replaceAll(
			this.CHART_EMPTY_CHAR,
			Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)
		)

		console.log(centeredPieChart)

 */
	}

	private renderMonochromeCenteredPieChart(percentDone: number): string {
		const radius = Math.floor(Math.min(process.stdout.rows, process.stdout.columns / 2) / 2) - 2
		const symbols: string[] = [this.CHART_FILL_CHAR, this.CHART_EMPTY_CHAR]
		const pieDetails: SquarePieChartDetails = {
			symbols: symbols,
			percentages: [percentDone, 1.0],
		}
		const squarePieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
		const pieChartTxt = StringUtils.TextBlocks.horizontallyDouble(squarePieChartTxt)
		return StringUtils.centerTextBlockHorizontallyOnScreen(pieChartTxt)
	}

	private renderTimeRemainingColoredFiglet(details: TimerDetails): string {
		const remainingMinutes: number = Math.floor(details.remainingSeconds / 60)
		const remainingSecondsInMinute: number = details.remainingSeconds - remainingMinutes * 60
		const timeRemaining = `${remainingMinutes}:` + `${remainingSecondsInMinute}`.padStart(2, '0')

		const timeRemainingFont = FigletFonts.COLOSSAL
		const timeRemainingFiglet = Fonts.render(timeRemainingFont, timeRemaining)
		const timeRemainingPadded = StringUtils.TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')

		return timeRemainingPadded
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

export { PieChart3 }
