import { PieChart2 } from './pie2'
import { SimpleBarTimerRenderer } from './simple-bar-timer-renderer'
import { SimpleBarTimerRenderer2 } from './simple-bar-timer-renderer2'
import { SimpleBarTimerRenderer3 } from './simple-bar-timer-renderer3'

class TimerDetails {
	constructor(public start: Date, public end: Date, public percentDone: number, public remainingSeconds: number) {}
}

interface TimerRenderer {
	render(details: TimerDetails): void
}

const ALL_RENDERERS = {
	pie: PieChart2,
	simpleBar: SimpleBarTimerRenderer3,
}

export { TimerDetails, TimerRenderer, ALL_RENDERERS }
