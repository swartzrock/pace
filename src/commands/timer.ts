import { clearScreenDown, cursorTo } from 'readline'
import { stdout } from 'process'
import { Command, Flags } from '@oclif/core'
import { PieChart2 } from '../renderers/pie2'
import { TimerDetails } from '../renderers/timer-renderer'

export default class Timer extends Command {
	static description = 'Displays a progress timer'

	static examples = [
		`pace timer -r pie -d 2.5m
`,
	]

	static flags = {
		help: Flags.help({ char: 'h' }),
		renderer: Flags.string({ name: 'renderer', char: 'r', description: 'Renderer', default: 'pie' }),
		duration: Flags.string({ name: 'duration', char: 'd', description: 'Duration', default: '20s' }),
	}

	static args = []

	readonly refreshInterval = 50

	nodeTimer?: NodeJS.Timeout
	createdAt = new Date()
	endingAt = new Date()

	timerCallback() {
		const now = new Date()
		const percentDone = Math.min(1.0, (now.getTime() - this.createdAt.getTime()) / (this.endingAt.getTime() - this.createdAt.getTime()))
		const remainingSeconds: number = Math.max(0, Math.floor((this.endingAt.getTime() - new Date().getTime()) / 1000))

		const details = new TimerDetails(this.createdAt, this.endingAt, percentDone, remainingSeconds)
		const renderer = new PieChart2()
		renderer.render(details)
		if (this.endingAt <= now) {
			console.log('')
			clearInterval(this.nodeTimer)
		}
	}

	async run(): Promise<void> {
		const { flags } = await this.parse(Timer)

		const durationSeconds = this.parseDurationFlagToSeconds(flags.duration)
		this.log(`you specified: pace timer -r ${flags.renderer} -d ${flags.duration} (${durationSeconds} seconds)`)
		this.endingAt = new Date(this.createdAt.getTime() + durationSeconds * 1000)

		cursorTo(stdout, 0, 0)
		clearScreenDown(stdout)
		this.nodeTimer = setInterval(() => {
			this.timerCallback()
		}, this.refreshInterval)
	}

	/**
	 * Returns the parsed duration (3m20s) as seconds (200)
	 * @param durationFlag the command flag specifying duration as [\dm][\ds]
	 */
	parseDurationFlagToSeconds(durationFlag: string): number {
		let totalSeconds = 0
		let matches: RegExpMatchArray[] = Array.from(durationFlag.matchAll(/(\d+)m/g))
		if (matches.length == 1) {
			totalSeconds += parseInt(matches[0][1]) * 60
		}

		matches = Array.from(durationFlag.matchAll(/(\d+)s/g))
		if (matches.length == 1) {
			totalSeconds += parseInt(matches[0][1])
		}

		return totalSeconds
	}
}
