import { Bar } from './bar'
import { PieChart } from './pie'
import { StringMatrix } from '../common/stringmatrix'
import { Circles } from './circles'
import { Colossal } from './colossal'
import { Slant } from './slant'
import { ColorWheel } from './colorwheel'
import { Point } from '../common/point'

class TimerDetails {
	constructor(
		public iteration: number,
		public totalIterations: number,
		public elapsedSeconds: number,
		public remainingSeconds: number
	) {}

	/**
	 * Returns a new TimerDetails based on iterations
	 * @param iteration the current 1-based iteration
	 * @param totalIterations total number of iterations in the timer
	 * @param callbackIntervalMs the callback interval for rendering the timer
	 */
	static newTimerDetails(iteration: number, totalIterations: number, callbackIntervalMs: number): TimerDetails {
		const iterationsPerSecond = 1000 / callbackIntervalMs

		const totalSeconds = totalIterations / iterationsPerSecond
		const elapsedSecondsF = (iteration - 1) / iterationsPerSecond
		const remainingSecondsF = totalSeconds - elapsedSecondsF

		const elapsedSeconds = Math.floor(elapsedSecondsF)
		const remainingSeconds = Math.floor(remainingSecondsF)

		return new TimerDetails(iteration, totalIterations, elapsedSeconds, remainingSeconds)
	}

	timeRemainingText(): string {
		const remainingMinutes: number = Math.floor(this.remainingSeconds / 60)
		const remainingSecondsInMinute: number = this.remainingSeconds - remainingMinutes * 60
		return `${remainingMinutes}:`.padStart(3, '0') + `${remainingSecondsInMinute}`.padStart(2, '0')
	}

	percentDone() {
		return this.iteration / this.totalIterations
	}

	toString(): string {
		return `TimerDetails(${this.iteration}, ${this.totalIterations}, ${this.elapsedSeconds}, ${
			this.remainingSeconds
		} - ${this.timeRemainingText()})`
	}
}

// todo take screen size for use in preview?
interface TimerRenderer {
	render(details: TimerDetails, terminalDims: Point): StringMatrix
}

const ALL_RENDERERS = {
	pie: PieChart,
	bar: Bar,
	circles: Circles,
	colossal: Colossal,
	slant: Slant,
	colorwheel: ColorWheel,
}

export { TimerDetails, TimerRenderer, ALL_RENDERERS }
