import { Command } from '@oclif/core'
import { ALL_RENDERERS, TimerDetails, TimerRenderer } from '../renderers/timer-renderer'
import { StringMatrix } from '../common/stringmatrix'
import onExit from 'signal-exit'
import { AnsiCursor } from '../common/ansicursor'
import { Colors, Xterm256 } from '../common/colors'
import { Rectangle } from '../common/Rectangle'
import * as readline from 'readline'
import { IntervalIterator } from '../common/intervalIterator'
import { Utils } from '../common/utils'
import { XtermColorGradients } from '../common/xtermcolorgradients'

/**
 * Timer is the main entrypoint for the pace timer
 * TODO preview mode shows all renderers at 66%.... if they support isPreviewable(), eg a sandglass renderer
 * TODO move the main body to a TimerApp class that can be well tested and used for a preview command
 * may require all previous iterations
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
			required: false,
			description: `the timer renderer:\n ${Timer.getAvailableRenderNamesText()}`,
			hidden: false,
		},
	]
	static strict = true

	readonly TIMER_CALLBACK_INTERVAL_MS = 100
	readonly STATUS_BAR_ITERATIONS = 100 // ten seconds
	readonly STATUS_BAR_BG_GRADIENT = XtermColorGradients.MONOCHROME_GRADIENT.slice(0, 4).reverse()

	renderer: TimerRenderer | null = null
	intervalIterator?: IntervalIterator
	matrix: StringMatrix = StringMatrix.createFromMultilineMonoString('')
	durationSeconds = 0
	totalIterations = 0
	isPaused = false
	statusBarMsg = ''
	rendererName = ''

	/**
	 * Entry point for the timer command
	 */
	async run(): Promise<void> {
		const { args } = await this.parse(Timer)

		this.renderer = this.getRenderer(args.renderer)
		if (!this.renderer || !this.rendererName) {
			this.log(`Please select one of these renderers: ${Timer.getAvailableRenderNamesText()}`)
			this.exit(1)
		}

		this.durationSeconds = Timer.parseDurationFlagToSeconds(args.duration)
		this.totalIterations = this.durationSeconds * (1000 / this.TIMER_CALLBACK_INTERVAL_MS) + 1

		// Set the status bar message
		const durationMinutes = Math.floor(this.durationSeconds / 60)
		const durationMinSeconds = this.durationSeconds - durationMinutes * 60
		const totalDuration =
			durationMinutes > 0
				? `${durationMinutes}-minute-${durationMinSeconds}-seconds`
				: `${durationMinSeconds}-second`
		this.statusBarMsg = `Starting a ${totalDuration} timer with the '${this.rendererName}' renderer. Press <space> to pause. `

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

		const details: TimerDetails = Timer.getTimerDetails(
			iteration,
			this.totalIterations,
			this.TIMER_CALLBACK_INTERVAL_MS
		)
		this.matrix = this.renderer.render(details)
		this.matrix.fitToWindow()
		this.writeStatusBarMsg(iteration)
		AnsiCursor.renderTopLeft(this.matrix.toString())
	}

	/**
	 * Adds a bar at the bottom of the screen with a status message, if
	 * the status message exists and the current iteration is less than the max iterations for showing this.
	 *
	 * @param iteration the current iteration
	 * @private
	 */
	private writeStatusBarMsg(iteration: number) {
		if (iteration >= this.STATUS_BAR_ITERATIONS) {
			return
		}

		const statusFg = Xterm256.SKYBLUE_1
		let statusBg: Xterm256 = this.STATUS_BAR_BG_GRADIENT[0]

		// If the status bar is more than half over, use a darkening gradient bg
		if (iteration > this.STATUS_BAR_ITERATIONS / 2) {
			const statusBarPctDone = iteration / (this.STATUS_BAR_ITERATIONS / 2) - 1

			const bgIndex = Math.floor(statusBarPctDone * this.STATUS_BAR_BG_GRADIENT.length)
			statusBg = this.STATUS_BAR_BG_GRADIENT[bgIndex]
		}

		// Add the status bar background to the matrix
		const statusBgFillChar = Colors.backgroundColor(' ', statusBg)
		const rows = this.matrix.rows()
		if (rows < process.stdout.rows) {
			this.matrix.padBottom(1, statusBgFillChar)
		} else {
			const bounds = new Rectangle(0, rows - 1, this.matrix.cols() - 2, rows - 1)
			this.matrix.fill(statusBgFillChar, bounds)
		}

		const statusMsgLeft = Math.floor((this.matrix.cols() - this.statusBarMsg.length) / 2)
		this.matrix.setFgBgString(this.statusBarMsg, statusFg, statusBg, statusMsgLeft, this.matrix.rows() - 1)
	}

	/**
	 * Builds information about the current status in the timer
	 * for use in rendering
	 * @param iteration the current 1-based iteration
	 * @param totalIterations total number of iterations in the timer
	 * @param callbackIntervalMs the callback interval for rendering the timer
	 * @private
	 */
	public static getTimerDetails(
		iteration: number,
		totalIterations: number,
		callbackIntervalMs: number
	): TimerDetails {
		const iterationsPerSecond = 1000 / callbackIntervalMs

		const totalSeconds = totalIterations / iterationsPerSecond
		const elapsedSecondsF = (iteration - 1) / iterationsPerSecond
		const remainingSecondsF = totalSeconds - elapsedSecondsF

		return new TimerDetails(iteration, totalIterations, Math.floor(elapsedSecondsF), Math.floor(remainingSecondsF))
	}

	/**
	 * Add a PAUSED message to the given StringMatrix.
	 * If the matrix is tall enough, add a nice bounding double box
	 * @param matrix the matrix on which to render the paused message
	 * @private
	 */
	public static addPausedMessage(matrix: StringMatrix): void {
		if (matrix.rows() < 3) {
			const pausedMatrix = StringMatrix.createFromMultilineMonoString('PAUSED')
			matrix.overlayCentered(pausedMatrix, '\u2500')
		} else {
			const message = '   ' + '       \n  PAUSED  \n          '
			const pausedMatrix = StringMatrix.createFromMultilineMonoString(message)
			pausedMatrix.addDoubleLineBox(new Rectangle(0, 0, 9, 2), Xterm256.RED_1)
			matrix.overlayCentered(pausedMatrix, '\u2530')
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
	getRenderer(rendererArg?: string): TimerRenderer | null {
		if (!rendererArg) {
			const renderKey = Utils.randomElement(Object.keys(ALL_RENDERERS))
			const rendererClass = ALL_RENDERERS[renderKey as keyof typeof ALL_RENDERERS]
			if (renderKey && rendererClass) {
				this.rendererName = renderKey
				return new rendererClass()
			}
		}
		if (rendererArg && rendererArg in ALL_RENDERERS) {
			this.rendererName = rendererArg
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
		// console.log('')
		process.exit(0)
	}
}

export { Timer }
