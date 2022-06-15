import { stdout } from 'process'
import { clearLine, cursorTo } from 'readline'
import { Colors, Xterm256 } from '../common/colors'
import { StringUtils } from '../common/stringutils'
import { SquarePieChart, SquarePieChartDetails } from '../common/squarepiechart'

import { TimerDetails, TimerRenderer } from './timer-renderer'
import { FigletFonts, Fonts } from '../common/fonts'

class PieChart2 implements TimerRenderer {
	readonly CHART_FILL_CHAR = '\u2588'
	readonly CHART_EMPTY_CHAR = '▎'
	readonly CHART_FILL_COLORS = [Xterm256.GREEN_1, Xterm256.GREENYELLOW, Xterm256.RED_1]
	readonly CHART_EMPTY_COLOR = Xterm256.GREY_007

	readonly palette2: Xterm256[] = [
		Xterm256.CYAN_1,
		Xterm256.CYAN_2,
		Xterm256.MEDIUMSPRINGGREEN,
		Xterm256.SPRINGGREEN_1,
		Xterm256.SPRINGGREEN_2A,
		Xterm256.GREEN_1,
	]

	pieChart = new SquarePieChart()

	sayHi = () => 'hello from pie'

	/**
	 * Entrypoint - renders this pie chart to the console
	 * @param details
	 */
	render(details: TimerDetails): void {
		const radius = Math.floor(Math.min(process.stdout.rows, process.stdout.columns / 2) / 2) - 2
		const fillColor = this.calcFillColor(details.percentDone)

		const symbols: string[] = [this.CHART_FILL_CHAR, this.CHART_EMPTY_CHAR]
		const pieDetails: SquarePieChartDetails = {
			symbols: symbols,
			percentages: [details.percentDone, 1.0],
		}
		const squarePieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
		const pieChartTxt = StringUtils.TextBlocks.horizontallyDouble(squarePieChartTxt)
		let centeredPieChart = StringUtils.centerTextBlockHorizontallyOnScreen(pieChartTxt)

		const timeRemainingFiglet = this.renderTimeRemainingFiglet(details)
		const gradientTime = Colors.setVerticalGradient(timeRemainingFiglet, this.palette2)
		centeredPieChart = StringUtils.centerTextBlockInTextBlock(gradientTime, centeredPieChart)

		// Note - pie chart colorization must be done after the time has been rendered onto it
		centeredPieChart = centeredPieChart.replaceAll(
			this.CHART_FILL_CHAR,
			Colors.foregroundColor(this.CHART_FILL_CHAR, fillColor)
		)
		centeredPieChart = centeredPieChart.replaceAll(
			this.CHART_EMPTY_CHAR,
			Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)
		)

		clearLine(stdout, 0)
		cursorTo(stdout, 0, 0)

		console.log(centeredPieChart)
	}

	private renderTimeRemainingFiglet(details: TimerDetails): string {
		const remainingMinutes: number = Math.floor(details.remainingSeconds / 60)
		const remainingSecondsInMinute: number = details.remainingSeconds - remainingMinutes * 60
		const timeRemaining = `${remainingMinutes}:` + `${remainingSecondsInMinute}`.padStart(2, '0')

		const timeRemainingFont = FigletFonts.COLOSSAL
		const timeRemainingFiglet = Fonts.render(timeRemainingFont, timeRemaining)
		const timeRemainingPadded = StringUtils.TextBlocks.setPadding(timeRemainingFiglet, 1, 1, ' ')

		return timeRemainingPadded
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

export { PieChart2 }

// module.exports = { pie: PieChart2 };
