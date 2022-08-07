/**
 * IntervalIterator calls a callback function repeatedly at a
 * set self-correcting interval until the requested # of iterations is hit
 */

class IntervalIterator {
	constructor(
		public intervalMs: number,
		public totalIterations: number,
		public callback: (iteration: number) => void,
		public finish?: () => void
	) {}

	timeoutId?: NodeJS.Timeout
	iteration = 0
	isPaused = false

	private startedAtTime = new Date().getTime()

	start() {
		this.startedAtTime = new Date().getTime()
		this.run()
	}

	private run() {
		if (this.isPaused) return

		const now = new Date()
		const expectedNowTime: number = this.startedAtTime + this.iteration * this.intervalMs
		const correctionMs = now.getTime() - expectedNowTime
		const nextTimeoutMs = this.intervalMs - correctionMs
		this.iteration++

		// If there's more iterations, set an adjusted timeout to keep the iterations even
		if (this.iteration < this.totalIterations) {
			this.timeoutId = setTimeout(() => {
				this.run()
			}, nextTimeoutMs)
		}

		this.callback(this.iteration)

		// If we're at or over the requested # of iterations, call the optional finish method
		if (this.iteration >= this.totalIterations) {
			this.finish?.()
		}
	}

	pause() {
		this.isPaused = true
	}

	resume() {
		this.isPaused = false

		// Reset the started-at time so we continue with consistent timing
		this.startedAtTime = new Date().getTime() - (this.iteration - 1) * this.intervalMs

		this.timeoutId = setTimeout(() => {
			this.run()
		}, this.intervalMs)
	}
}

export { IntervalIterator }
