import { Command } from '@oclif/core'
import { ALL_RENDERERS, TimerDetails } from '../../renderers/timer-renderer'
import { Timer } from '../timer'
import { PieChart } from '../../renderers/pie'
import { Loggy } from '../../common/loggy'
import { Point } from '../../common/point'
import { Utils } from '../../common/utils'

export default class ColorBlocks extends Command {
	static description = 'Preview the Pace renderers'
	static examples = ['pace tools preview']

	static flags = {}
	static args = []
	static strict = true

	async run(): Promise<void> {
		console.log('in preview')

		const totalSecs = 300
		const elapsedSecs = 40
		const remainingSecs = totalSecs - elapsedSecs
		const totalIterations = totalSecs * Timer.TIMER_CALLBACK_INTERVAL_MS
		const iteration = elapsedSecs * Timer.TIMER_CALLBACK_INTERVAL_MS
		const details = new TimerDetails(iteration, totalIterations, elapsedSecs, remainingSecs)
		const terminalDims = new Point(Utils.halfInt(process.stdout.columns), Utils.halfInt(process.stdout.rows))
		const matrix = new PieChart().render(details, terminalDims)
		Loggy.raw(matrix)

		// for (const [k, v] of Object.entries(ALL_RENDERERS)) {
		// 	console.log(`renderer ${k} is at ${v}`)
		// }
	}
}
