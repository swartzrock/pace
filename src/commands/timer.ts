import { clearScreenDown, cursorTo } from 'readline'
import { stdout } from 'process'
import { Command, CommandHelp, Flags } from '@oclif/core'
import { StringUtils } from '../common/stringutils'
import { PieChart2 } from '../renderers/pie2'
import { ALL_RENDERERS, TimerDetails, TimerRenderer } from '../renderers/timer-renderer'
import { Utils } from '../common/utils'

export default class Timer extends Command {
	static description = 'Displays a progress timer'

	static examples = [
		`pace timer -r pie -d 2.5m
`,
	]

	static flags = {
		help: Flags.help({ char: 'h' }),
		// renderer: Flags.string({ name: 'renderer', char: 'r', description: 'Renderer', default: 'pie' }),
		// duration: Flags.string({ name: 'duration', char: 'd', description: 'Duration', default: '20s' }),
	}

	static args = [
		{
			name: 'duration',
			required: true,
			description: 'duration in (m)inutes and (s)seconds (eg 3m10s = 190 seconds)',
			hidden: false,
		},
		{
			name: 'renderer',
			required: false,
			description: 'the timer renderer, or leave blank for a random one',
			hidden: false,
		},
	]
	static strict = true

	readonly refreshInterval = 50

	nodeTimer?: NodeJS.Timeout
	createdAt = new Date()
	endingAt = new Date()
	durationSeconds = 0
	renderer: TimerRenderer | null = null

	timerCallback() {
		const now = new Date()
		const percentDone = Math.min(
			1.0,
			(now.getTime() - this.createdAt.getTime()) / (this.endingAt.getTime() - this.createdAt.getTime())
		)
		const remainingSeconds: number = Math.max(
			0,
			Math.floor((this.endingAt.getTime() - new Date().getTime()) / 1000)
		)

		// console.log(`renderer = ${this.renderer}`)

		const details = new TimerDetails(this.createdAt, this.endingAt, percentDone, remainingSeconds)
		this.renderer!.render(details)
		if (this.endingAt <= now) {
			console.log('')
			clearInterval(this.nodeTimer)
		}
	}

	async run(): Promise<void> {
		const { flags, args } = await this.parse(Timer)

		this.renderer = this.getRenderer(args.renderer)
		this.durationSeconds = this.parseDurationFlagToSeconds(args.duration)
		this.log(
			`you specified: pace timer ${args.duration} (${this.durationSeconds} seconds) with ${this.renderer} renderer`
		)
		this.endingAt = new Date(this.createdAt.getTime() + this.durationSeconds * 1000)
		this.start()
	}

	start() {
		cursorTo(stdout, 0, 0)
		clearScreenDown(stdout)
		this.nodeTimer = setInterval(() => {
			this.timerCallback()
		}, this.refreshInterval)
	}

	getRenderer(rendererArg: string): TimerRenderer {
		let rendererClass = Utils.randomElement(Object.values(ALL_RENDERERS)) ?? ALL_RENDERERS.pie
		if (rendererArg && rendererArg in ALL_RENDERERS) {
			rendererClass = ALL_RENDERERS[rendererArg as keyof typeof ALL_RENDERERS]
		}

		return new rendererClass()
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
