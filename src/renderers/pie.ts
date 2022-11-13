import {Colors, Xterm256} from '../common/colors'
import {SquarePieChart, SquarePieChartDetails} from '../common/squarepiechart'
import {StringMatrix} from '../common/stringmatrix'
import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {TextBlocks} from '../common/textblocks'
import {Point} from '../common/point'
import {UnicodeChars} from '../common/unicodechars'
import {XtermGradients} from '../common/xtermgradients'
import {TextEffects} from "../common/textEffects";

class Pie implements TimerRenderer {
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
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		const fillColor = TimerRenderer.getGreenYellowRedColor(details.percentDone())
		const coloredFillChar = Colors.foregroundColor(this.CHART_FILL_CHAR, fillColor)
		const coloredEmptyChar = Colors.foregroundColor(this.CHART_FILL_CHAR, this.CHART_EMPTY_COLOR)

		// render the main pie chart
		const centeredMonoChart: string = this.renderMonochromeCenteredPieChart(details.percentDone(), terminalDims)
		const matrix = StringMatrix.createFromMultilineMonoString(centeredMonoChart)
		matrix.replaceAll(this.CHART_FILL_CHAR, coloredFillChar)
		matrix.replaceAll(this.CHART_EMPTY_CHAR, coloredEmptyChar)

		TextEffects.renderShadowedText(details.timeRemainingText(), matrix, Pie.TIME_REMAINING_GRADIENT, UnicodeChars.BLOCK_FULL, this.CHART_SHADOW_CHAR, false)

		return matrix
	}

	private renderMonochromeCenteredPieChart(percentDone: number, terminalDims: Point): string {
		const radius = Math.floor(Math.min(terminalDims.row, terminalDims.col / 2) / 2) - 2
		const symbols: string[] = [this.CHART_FILL_CHAR, this.CHART_EMPTY_CHAR]
		const pieDetails: SquarePieChartDetails = {
			symbols: symbols,
			percentages: [percentDone, 1.0],
		}
		const squarePieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
		return TextBlocks.horizontallyDouble(squarePieChartTxt)
	}
}

export { Pie }
