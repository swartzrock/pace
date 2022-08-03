import { Command } from '@oclif/core'
import { ALL_RENDERERS, TimerDetails, TimerRenderer } from '../renderers/timer-renderer'
import { StringMatrix } from '../common/stringmatrix'
import onExit from 'signal-exit'
import { AnsiCursor } from '../common/ansicursor'
import { Xterm256 } from '../common/colors'
import { Rectangle } from '../common/Rectangle'
import * as readline from 'readline'

enum TimerState {
	RUN,
	PAUSE_STARTED_SHOW_MSG,
	PAUSED,
}

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
			required: true,
			description: `the timer renderer:\n ${Timer.rendererNames()}`,
			hidden: false,
		},
	]
	static strict = true

	readonly TIMER_CALLBACK_INTERVAL_MS = 100

	nodeTimer?: NodeJS.Timeout
	createdAt = new Date()
	endingAt = new Date()
	durationSeconds = 0
	renderer: TimerRenderer | null = null
	iterations = 0
	totalIterations = 0

	timerState = TimerState.RUN

	private togglePaused(): void {
		if (this.timerState == TimerState.RUN) {
			this.timerState = TimerState.PAUSE_STARTED_SHOW_MSG
		} else if (this.timerState == TimerState.PAUSED) {
			this.timerState = TimerState.RUN
		}
	}

	private endTimer(): void {
		console.log('')
		clearInterval(this.nodeTimer)
		process.exit(0)
	}

	private renderTimerToConsole(renderer: TimerRenderer): void {
		// If we're already paused with a pause message, just return
		if (this.timerState == TimerState.PAUSED) {
			return
		}

		this.iterations++
		const details: TimerDetails = this.details()
		const matrix: StringMatrix = renderer.render(details)

		// If pause has been started, render a PAUSED message on top of the rendering
		if (this.timerState == TimerState.PAUSE_STARTED_SHOW_MSG) {
			Timer.addPausedMessage(matrix)
			this.timerState = TimerState.PAUSED
		}

		AnsiCursor.renderTopLeft(matrix.toString())

		if (this.iterations >= this.totalIterations) {
			this.endTimer()
		}
	}

	private static addPausedMessage(matrix: StringMatrix): void {
		if (matrix.rows() < 3) {
			const pausedMatrix = StringMatrix.fromMultilineMonochromeString('PAUSED')
			matrix.overlayCentered(pausedMatrix, '\u2500')
		} else {
			const message = '   ' + '       \n  PAUSED  \n          '
			const pausedMatrix = StringMatrix.fromMultilineMonochromeString(message)
			pausedMatrix.addDoubleLineBox(new Rectangle(0, 0, 9, 2), Xterm256.RED_1)
			matrix.overlayCentered(pausedMatrix, '\u2500')
		}
	}

	private details(): TimerDetails {
		const iterationsPerSecond = 1000 / this.TIMER_CALLBACK_INTERVAL_MS

		const totalSeconds = this.totalIterations / iterationsPerSecond
		const elapsed = Math.floor(this.iterations / iterationsPerSecond)
		const remaining = Math.floor(totalSeconds - elapsed)
		return new TimerDetails(this.iterations, this.totalIterations, elapsed, remaining)
	}

	timerCallback() {
		if (this.renderer === null) {
			Timer.exitWithError('Error: No renderer found')
		} else {
			this.renderTimerToConsole(this.renderer)
		}
	}

	private static rendererNames(): string {
		const rendererKeys: string[] = <string[]>Object.keys(ALL_RENDERERS)
		rendererKeys.sort()
		return rendererKeys.join(', ')
	}

	async run(): Promise<void> {
		const { args } = await this.parse(Timer)

		this.renderer = Timer.getRenderer(args.renderer)
		if (!this.renderer) {
			this.log(`Please select one of these renderers: ${Timer.rendererNames()}`)
			this.exit(1)
		}
		this.durationSeconds = this.parseDurationFlagToSeconds(args.duration)
		this.endingAt = new Date(this.createdAt.getTime() + this.durationSeconds * 1000)
		this.totalIterations = this.durationSeconds * (1000 / this.TIMER_CALLBACK_INTERVAL_MS)

		// Hide the cursor now and restore it when the program exits
		AnsiCursor.hideCursor()
		onExit(() => AnsiCursor.showCursor())

		readline.emitKeypressEvents(process.stdin)
		process.stdin.setRawMode(true)
		process.stdin.on('keypress', (str, key) => {
			if (key.ctrl && key.name === 'c') {
				process.exit() // eslint-disable-line no-process-exit
			}
			if (str === ' ') {
				this.togglePaused()
			}
		})

		this.timerCallback()

		this.nodeTimer = setInterval(() => {
			this.timerCallback()
		}, this.TIMER_CALLBACK_INTERVAL_MS)
	}

	/**
	 * Returns the selected pace renderer, or a random one if the argument is missing
	 * @param rendererArg the renderer argument from the command line
	 * @private
	 */
	static getRenderer(rendererArg: string): TimerRenderer | null {
		if (rendererArg in ALL_RENDERERS) {
			const rendererClass = ALL_RENDERERS[rendererArg as keyof typeof ALL_RENDERERS]
			return new rendererClass()
		}

		return null
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

	private static exitWithError(msg: string): void {
		console.log(msg)
		process.exit(1)
	}
}
