import {StringUtils} from "../common/stringutils";

class TimerDetails {
	public statusBarMessage = ''

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
		return StringUtils.formatMinutesSecondsShort(this.remainingSeconds)
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

export { TimerDetails }
