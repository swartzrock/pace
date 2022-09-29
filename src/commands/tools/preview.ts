import { Command } from '@oclif/core'
import { Timer } from '../timer'
import { Point } from '../../common/point'
import { Utils } from '../../common/utils'
import { Xterm256 } from '../../common/colors'
import { Rectangle } from '../../common/rectangle'
import { TimerDetails } from '../../renderers/timerDetails'
import { AllRenderers, TimerRenderer } from '../../renderers/timerRenderer'
import { StringUtils } from '../../common/stringutils'
import { StringMatrix } from '../../common/stringmatrix'

class Preview extends Command {
	static description = 'Preview the Pace renderers'
	static examples = ['pace tools preview']

	static strict = true

	readonly DETAILS = TimerDetails.newTimerDetails(2000, 3000, Timer.TIMER_CALLBACK_INTERVAL_MS)
	readonly RENDER_DIMENSION = new Point(
		Utils.halfInt(process.stdout.columns) - 1,
		Utils.halfInt(process.stdout.rows) - 1
	)

	render(name: string, r: TimerRenderer): StringMatrix {
		const matrix = r.render(this.DETAILS, this.RENDER_DIMENSION)
		matrix.addDoubleLineBox(new Rectangle(0, 0, matrix.cols() - 1, matrix.rows() - 1), Xterm256.GREY_089)
		const title = ` ${StringUtils.capitalize(name)} `
		matrix.setHorizontallyCenteredMonochromeString(title, 0)
		return matrix
	}

	async run(): Promise<void> {
		Utils.grouped(Object.entries(AllRenderers), 2).forEach((pair) => {
			const leftMatrix = this.render(pair[0][0], pair[0][1])
			const rightMatrix = pair.length == 2 ? this.render(pair[1][0], pair[1][1]) : null
			const combinedRows = rightMatrix ? Math.max(leftMatrix.rows(), rightMatrix.rows()) : leftMatrix.rows()
			const outMatrix = StringMatrix.createUniformMatrix(process.stdout.columns, combinedRows, ' ')
			outMatrix.overlayAt(leftMatrix, new Point(0, 0))
			if (rightMatrix) outMatrix.overlayAt(rightMatrix, new Point(leftMatrix.cols() + 1, 0))

			console.log(outMatrix.toString())
		})
	}
}

export { Preview }
