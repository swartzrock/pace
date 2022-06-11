class TimerDetails {
	constructor(public start: Date, public end: Date, public percentDone: number, public remainingSeconds: number) {}
}

interface TimerRenderer {
	render(details: TimerDetails): void
}

export { TimerDetails, TimerRenderer }
