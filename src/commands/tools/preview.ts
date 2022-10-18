import { Command } from '@oclif/core'
import { Timer } from '../timer'
import { Point } from '../../common/point'
import { Utils } from '../../common/utils'
import { Colors, Xterm256 } from '../../common/colors'
import { Rectangle } from '../../common/rectangle'
import { TimerDetails } from '../../renderers/timerDetails'
import { AllRenderers, TimerRenderer } from '../../renderers/timerRenderer'
import { StringUtils } from '../../common/stringutils'
import { StringMatrix } from '../../common/stringmatrix'
import { FigletFonts, Fonts } from '../../common/fonts'
import { XtermGradients } from '../../common/xtermgradients'
import { TextBlocks } from '../../common/textblocks'

class Preview extends Command {
	static description = 'Preview the Pace renderers'
	static examples = ['pace tools preview']

	static strict = true

	readonly DETAILS = TimerDetails.newTimerDetails(2000, 3000, 100)
	readonly RENDER_DIMENSION = new Point(
		Utils.halfInt(process.stdout.columns) - 1,
		Utils.halfInt(process.stdout.rows) - 1
	)

	render(name: string, r: TimerRenderer): StringMatrix {
		const matrix = r.render(this.DETAILS, this.RENDER_DIMENSION)
		matrix.addSingleLineBox(new Rectangle(0, 0, matrix.cols() - 1, matrix.rows() - 1), Xterm256.GREY_035)
		const title = ` ${StringUtils.capitalize(name)} `
		matrix.setHorizontallyCenteredMonochromeString(title, 0)
		return matrix
	}

	printMatrixPair(leftMatrix: StringMatrix, rightMatrix: StringMatrix) {
		const maxRows = Math.max(leftMatrix.rows(), rightMatrix.rows())
		const outMatrix = StringMatrix.createUniformMatrix(process.stdout.columns, maxRows, ' ')
		outMatrix.overlayAt(leftMatrix, new Point(0, Utils.halfInt(maxRows - leftMatrix.rows())))
		outMatrix.overlayAt(rightMatrix, new Point(leftMatrix.cols() + 1, Utils.halfInt(maxRows - rightMatrix.rows())))
		console.log(`${outMatrix}`)
	}

	async run(): Promise<void> {
		const titleBlock = TextBlocks.centerHorizontallyOnScreen(
			Fonts.render(FigletFonts.ANSI_REGULAR, 'pace renderers')
		)

		console.log('')
		console.log('')
		console.log(Colors.setVerticalGradient(titleBlock, XtermGradients.DOUBLE_COLOR_GRADIENTS.PURPLEB_TO_PURPLEA))

		const matrixes: Array<StringMatrix> = Object.entries(AllRenderers).map((a) => this.render(a[0], a[1]))
		const matrixPairs: Array<Array<StringMatrix>> = Utils.grouped(matrixes, 2)
		matrixPairs.filter((a) => a.length == 2).forEach((a) => this.printMatrixPair(a[0], a[1]))
		matrixPairs.filter((a) => a.length == 1).forEach((a) => console.log(`${a[0]}`))
	}
}

export { Preview }
