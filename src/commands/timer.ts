import {Command} from '@oclif/core'
import {AllRenderers, TimerRenderer} from '../renderers/timerRenderer'
import {StringMatrix} from '../common/stringmatrix'
import onExit from 'signal-exit'
import {AnsiCursor} from '../common/ansicursor'
import {Colors, Xterm256} from '../common/colors'
import {Rectangle} from '../common/rectangle'
import * as readline from 'readline'
import {IntervalIterator} from '../common/intervalIterator'
import {XtermGradients} from '../common/xtermgradients'
import {Point} from '../common/point'
import {TimerDetails} from '../renderers/timerDetails'
import {Loggy} from "../common/loggy";

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
			required: false,
			default: 'shuffle',
			description: `the timer renderer:\n ${Timer.getAvailableRenderNamesText()}`,
			hidden: false,
		},
	]
	static strict = true

	static TIMER_CALLBACK_INTERVAL_MS = 100
	readonly STATUS_BAR_ITERATIONS = 70
	readonly STATUS_BAR_BG_GRADIENT = XtermGradients.MONOCHROME_GRADIENT.slice(0, 4).reverse()

	renderer: TimerRenderer | null = null
	intervalIterator?: IntervalIterator
	matrix: StringMatrix = StringMatrix.createFromMultilineMonoString('')
	durationSeconds = 0
	totalIterations = 0
	isPaused = false
	statusBarMsg = ''
	rendererName = ''
	statusBarBgColor = this.STATUS_BAR_BG_GRADIENT[0]

	/**
	 * Entry point for the timer command
	 */
	async run(): Promise<void> {
		const { args } = await this.parse(Timer)

		// Enable the logger for development mode
		if (this.config.options.root.endsWith("dev")) Loggy.enable()

		// Parse the duration and renderer argument, which may be combined in the duration argument
		// if the optional 'timer' command was left out
		let durationArg: string = args.duration
		let rendererArg: string = args.renderer
		const durationAndRenderer = durationArg.split(':')
		if (durationAndRenderer.length == 2) {
			durationArg = durationAndRenderer[0]
			rendererArg = durationAndRenderer[1]
		}

		this.renderer = this.getRenderer(rendererArg)
		if (!this.renderer || !this.rendererName) {
			this.log(`Please select one of these renderers: ${Timer.getAvailableRenderNamesText()}`)
			this.exit(1)
		}

		this.durationSeconds = Timer.parseDurationFlagToSeconds(durationArg)
		this.totalIterations = this.durationSeconds * (1000 / Timer.TIMER_CALLBACK_INTERVAL_MS) + 1

		// Set the status bar message
		const durationMinutes = Math.floor(this.durationSeconds / 60)
		const durationMinSeconds = this.durationSeconds - durationMinutes * 60
		let totalDuration = `${durationMinutes}-minute-${durationMinSeconds}-second`
		if (durationMinutes < 1) totalDuration = `${durationMinSeconds}-second`
		else if (durationMinSeconds == 0) totalDuration = `${durationMinutes}-minute`
		this.statusBarMsg = `Starting a ${totalDuration} timer with the '${this.rendererName}' renderer. Press <space> to pause. `

		// Hide the cursor now and restore it when the program exits
		AnsiCursor.hideCursor()
		onExit(() => AnsiCursor.showCursor())

		this.listenForKeyEvents()

		this.intervalIterator = new IntervalIterator(
			Timer.TIMER_CALLBACK_INTERVAL_MS,
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

		const details: TimerDetails = TimerDetails.newTimerDetails(
			iteration,
			this.totalIterations,
			Timer.TIMER_CALLBACK_INTERVAL_MS
		)
		const terminalDims = new Point(process.stdout.columns, process.stdout.rows)
		this.matrix = this.renderer.render(details, terminalDims)
		this.matrix.fitToWindow()
		this.writeStatusBarMsg(details)
		AnsiCursor.renderTopLeft(this.matrix.toString())
	}

	/**
	 * Adds a bar at the bottom of the screen with a status message, if
	 * the status message exists and the current iteration is less than the max iterations for showing this.
	 *
	 * @param details the current timer details
	 */
	private writeStatusBarMsg(details: TimerDetails) {
		if (details.iteration >= this.STATUS_BAR_ITERATIONS && details.statusBarMessage == '') {
			return
		}

		const statusFg = Xterm256.SKYBLUE_1
		// let statusBg: Xterm256 = this.STATUS_BAR_BG_GRADIENT[0]

		// If the status bar is more than half over, use a darkening gradient bg
		if (details.iteration > this.STATUS_BAR_ITERATIONS / 2 && details.iteration < this.STATUS_BAR_ITERATIONS) {
			const statusBarPctDone = details.iteration / (this.STATUS_BAR_ITERATIONS / 2) - 1

			const bgIndex = Math.floor(statusBarPctDone * this.STATUS_BAR_BG_GRADIENT.length)
			this.statusBarBgColor = this.STATUS_BAR_BG_GRADIENT[bgIndex]
		}

		// Add the status bar background to the matrix
		const statusBgFillChar = Colors.backgroundColor(' ', this.statusBarBgColor)
		const rows = this.matrix.rows()
		if (rows < process.stdout.rows) {
			this.matrix.padBottom(1, statusBgFillChar)
		} else {
			const bounds = new Rectangle(0, rows - 1, this.matrix.cols() - 2, rows - 1)
			this.matrix.fill(statusBgFillChar, bounds)
		}

		const message = details.statusBarMessage || this.statusBarMsg

		const startLoc = new Point(Math.floor((this.matrix.cols() - message.length) / 2), this.matrix.rows() - 1)

		this.matrix.colorAndSetString(message, statusFg, this.statusBarBgColor, startLoc)
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
		return (<string[]>Object.keys(AllRenderers)).sort().join(', ')
	}

	/**
	 * Returns the selected pace renderer, or shuffle if the argument is missing
	 * @param rendererArg the renderer argument from the command line
	 * @private
	 */
	getRenderer(rendererArg: string): TimerRenderer | null {
		this.rendererName = rendererArg
		const matchingRenderers = AllRenderers.renderers.filter((i) => i.name == rendererArg)
		return matchingRenderers.length == 1 ? matchingRenderers[0].renderer : null
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
		process.exit(0)
	}
}

export { Timer }
