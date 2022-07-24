import { Command } from '@oclif/core'
import { ALL_RENDERERS, TimerDetails, TimerRenderer } from '../renderers/timer-renderer'
import { Utils } from '../common/utils'
import { StringMatrix } from '../common/stringmatrix'
import onExit from 'signal-exit'
import { AnsiCursor } from '../common/ansicursor'

export default class Timer extends Command {
	static description = 'Displays a progress timer'

	static examples = [`pace timer 2.5m pie`]

	static flags = {}

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

	readonly TIMER_CALLBACK_INTERVAL_MS = 50

	nodeTimer?: NodeJS.Timeout
	createdAt = new Date()
	endingAt = new Date()
	durationSeconds = 0
	renderer: TimerRenderer | null = null

	timerCallback() {
		const now = new Date()
		const details: TimerDetails = this.details(now)
		const matrix: StringMatrix = this.renderer?.render(details) ?? new StringMatrix('')

		AnsiCursor.renderTopLeft(matrix.toString())

		if (this.endingAt <= now) {
			console.log('')
			clearInterval(this.nodeTimer)
		}
	}

	private details(now: Date): TimerDetails {
		const percentDone = Math.min(
			1.0,
			(now.getTime() - this.createdAt.getTime()) / (this.endingAt.getTime() - this.createdAt.getTime())
		)
		const remainingSeconds: number = Math.max(
			0,
			Math.floor((this.endingAt.getTime() - new Date().getTime()) / 1000)
		)

		return new TimerDetails(this.createdAt, this.endingAt, percentDone, remainingSeconds)
	}

	async run(): Promise<void> {
		const { args } = await this.parse(Timer)

		this.renderer = Timer.getRenderer(args.renderer)
		this.durationSeconds = this.parseDurationFlagToSeconds(args.duration)
		this.endingAt = new Date(this.createdAt.getTime() + this.durationSeconds * 1000)

		// Hide the cursor now and restore it when the program exits
		AnsiCursor.hideCursor()
		onExit(() => AnsiCursor.showCursor())

		this.nodeTimer = setInterval(() => {
			this.timerCallback()
		}, this.TIMER_CALLBACK_INTERVAL_MS)
	}

	/**
	 * Returns the selected pace renderer, or a random one if the argument is missing
	 * @param rendererArg the renderer argument from the command line
	 * @private
	 */
	static getRenderer(rendererArg?: string): TimerRenderer {
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
	private parseDurationFlagToSeconds(durationFlag: string): number {
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
