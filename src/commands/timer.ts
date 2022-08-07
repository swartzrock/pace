import { Command } from '@oclif/core'
import { ALL_RENDERERS, TimerDetails, TimerRenderer } from '../renderers/timer-renderer'
import { StringMatrix } from '../common/stringmatrix'
import onExit from 'signal-exit'
import { AnsiCursor } from '../common/ansicursor'
import { Xterm256 } from '../common/colors'
import { Rectangle } from '../common/Rectangle'
import * as readline from 'readline'
import { IntervalIterator } from '../common/intervalIterator'

/**
 * Timer is the main entrypoint for the pace timer
 */
class Timer extends Command {
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
			description: `the timer renderer:\n ${Timer.getAvailableRenderNamesText()}`,
			hidden: false,
		},
	]
	static strict = true

	readonly TIMER_CALLBACK_INTERVAL_MS = 100

	// nodeTimer?: NodeJS.Timeout
	intervalIterator?: IntervalIterator
	durationSeconds = 0
	renderer: TimerRenderer | null = null
	totalIterations = 0
	matrix: StringMatrix = StringMatrix.fromMultilineMonochromeString('')
	isPaused = false

	/**
	 * Entry point for the timer command
	 */
	async run(): Promise<void> {
		const { args } = await this.parse(Timer)

		this.renderer = Timer.getRenderer(args.renderer)
		if (!this.renderer) {
			this.log(`Please select one of these renderers: ${Timer.getAvailableRenderNamesText()}`)
			this.exit(1)
		}

		this.durationSeconds = Timer.parseDurationFlagToSeconds(args.duration)
		this.totalIterations = this.durationSeconds * (1000 / this.TIMER_CALLBACK_INTERVAL_MS) + 1

		// Hide the cursor now and restore it when the program exits
		AnsiCursor.hideCursor()
		onExit(() => AnsiCursor.showCursor())

		this.listenForKeyEvents()

		this.intervalIterator = new IntervalIterator(
			this.TIMER_CALLBACK_INTERVAL_MS,
			this.totalIterations,
			(iteration: number) => this.timerCallback(iteration),
			() => Timer.finish()
		)
		this.intervalIterator.start()
	}

	/**
	 * Tell readline to send keypress events, and monitor them
	 * for ctrl-c (exit) and space (pause)
	 * @private
	 */
	private listenForKeyEvents(): void {
		readline.emitKeypressEvents(process.stdin)
		process.stdin.setRawMode(true)
		process.stdin.on('keypress', (str, key) => {
			if (key.ctrl && key.name === 'c') {
				process.exit() // eslint-disable-line no-process-exit
			}
			if (str === ' ') {
				if (!this.isPaused) {
					this.intervalIterator?.pause()
					Timer.addPausedMessage(this.matrix)
					AnsiCursor.renderTopLeft(this.matrix.toString())
				} else {
					this.intervalIterator?.resume()
				}

				this.isPaused = !this.isPaused
			}
		})
	}

	/**
	 * Executed every X ms to update the console with a new render
	 * @param iteration the current 1-based iteration
	 * @private
	 */
	private timerCallback(iteration: number) {
		if (this.renderer === null) {
			this.log(`Please select one of these renderers: ${Timer.getAvailableRenderNamesText()}`)
			process.exit(1)
			return
		}

		const details: TimerDetails = this.buildTimerDetails(iteration)
		this.matrix = this.renderer.render(details)

		AnsiCursor.renderTopLeft(this.matrix.toString())
	}

	/**
	 * Builds information about the current status in the timer
	 * for use in rendering
	 * @param iteration the current 1-based iteration
	 * @private
	 */
	private buildTimerDetails(iteration: number): TimerDetails {
		const iterationsPerSecond = 1000 / this.TIMER_CALLBACK_INTERVAL_MS

		const totalSeconds = this.totalIterations / iterationsPerSecond
		const elapsed = Math.floor(iteration / iterationsPerSecond)
		const remaining = Math.floor(totalSeconds - elapsed)
		return new TimerDetails(iteration, this.totalIterations, elapsed, remaining)
	}

	/**
	 * Add a PAUSED message to the given StringMatrix.
	 * If the matrix is tall enough, add a nice bounding double box
	 * @param matrix the matrix on which to render the paused message
	 * @private
	 */
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

	/**
	 * Returns a list of the available renderer names as text for the help msg
	 * @private
	 */
	private static getAvailableRenderNamesText(): string {
		const rendererKeys: string[] = <string[]>Object.keys(ALL_RENDERERS)
		rendererKeys.sort()
		return rendererKeys.join(', ')
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
	private static parseDurationFlagToSeconds(durationFlag: string): number {
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

	/**
	 * Clean up and exit
	 * `process.exit` is required since we're monitoring readline for pausing
	 */
	private static finish(): void {
		console.log('')
		process.exit(0)
	}
}

export { Timer }
