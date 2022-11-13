import {Colors, Xterm256} from '../common/colors'

import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {StringMatrix} from '../common/stringmatrix'
import {UnicodeChars} from '../common/unicodechars'
import {XtermGradients} from '../common/xtermgradients'
import {SquarePieChart, SquarePieChartDetails} from '../common/squarepiechart'
import {TextBlocks} from '../common/textblocks'
import {Utils} from '../common/utils'
import _ from 'lodash'
import {Point} from '../common/point'
import {TextEffects} from "../common/textEffects";

/**
 * Displays a green, yellow, and then red color wheel
 */
class ColorWheel implements TimerRenderer {
	readonly CHART_FILL_CHAR = UnicodeChars.BLOCK_FULL
	readonly CHART_SHADOW_CHAR = UnicodeChars.SHADE_DARK
	readonly ALPHABET = Array.from('abcdefghijklmnopqrstuvwxyz')
	readonly TEXT_GRADIENT = [Xterm256.WHITE]

	readonly SLICES = 24
	readonly SLICE_PERCENT = 0.0417
	readonly PERCENTAGES = Utils.fill(this.SLICE_PERCENT, this.SLICES)

	readonly GREEN_GRADIENT = _.concat(
		XtermGradients.SINGLE_COLOR_GRADIENTS.GREEN_4_TO_DODGERBLUE_1,
		Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.GREEN_3A_TO_DEEPSKYBLUE_1),
		XtermGradients.SINGLE_COLOR_GRADIENTS.GREEN_3B_TO_TURQUOISE_2,
		Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.GREEN_1_TO_CYAN_1),
	)

	readonly YELLOW_GRADIENT = _.concat(
		XtermGradients.SINGLE_COLOR_GRADIENTS.YELLOW_3B_TO_LIGHTSTEELBLUE_1,
		Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.YELLOW_2_TO_LIGHTCYAN_1),
		XtermGradients.SINGLE_COLOR_GRADIENTS.YELLOW_1_TO_GREY_100,
		Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.GOLD_1_TO_THISTLE_1),
	)

	readonly RED_GRADIENT = _.concat(
		XtermGradients.SINGLE_COLOR_GRADIENTS.RED_3B_TO_MAGENTA_2A,
		Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.DARKORANGE_3B_TO_MEDIUMORCHID_1A),
		XtermGradients.SINGLE_COLOR_GRADIENTS.ORANGERED_1_TO_MEDIUMORCHID_1B,
		Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.RED_1_TO_MAGENTA_1),
	)

	readonly pieChart = new SquarePieChart()

	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		let gradient: number[] = this.GREEN_GRADIENT
		if (details.percentDone() > 0.9) {
			gradient = this.RED_GRADIENT
		} else if (details.percentDone() > 0.7) {
			gradient = this.YELLOW_GRADIENT
		}

		Utils.rotateRight(gradient)

		const radius = Math.floor(Math.min(terminalDims.row, terminalDims.col / 2) / 2) - 2

		const pieDetails: SquarePieChartDetails = {
			symbols: this.ALPHABET,
			percentages: this.PERCENTAGES,
		}
		const squarePieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
		const pieChartTxt = TextBlocks.horizontallyDouble(squarePieChartTxt)
		const matrix = StringMatrix.createFromMultilineMonoString(pieChartTxt)

		// Replace the alphabet pie slices with colored blocks
		for (let i = 0; i < Math.min(this.SLICES, this.ALPHABET.length); i++) {
			const color = gradient[i % gradient.length]
			const fill = Colors.foregroundColor(this.CHART_FILL_CHAR, color)
			matrix.replaceAll(this.ALPHABET[i], fill)
		}

		TextEffects.renderShadowedText(details.timeRemainingText(), matrix, this.TEXT_GRADIENT, UnicodeChars.BLOCK_FULL,
			this.CHART_SHADOW_CHAR, false)

		return matrix
	}
}

export { ColorWheel }
