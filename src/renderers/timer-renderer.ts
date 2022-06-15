import { SimpleBarTimerRenderer3 } from './simple-bar-timer-renderer3'
import { PieChart3 } from './pie3'
import { PieChart2 } from './pie2'
import { SimpleBarTimerRenderer2 } from './simple-bar-timer-renderer2'

class TimerDetails {
	constructor(public start: Date, public end: Date, public percentDone: number, public remainingSeconds: number) {}
}

interface TimerRenderer {
	render(details: TimerDetails): void
}

const ALL_RENDERERS = {
	pie: PieChart3,
	pie2Unused: PieChart2,
	simpleBar: SimpleBarTimerRenderer3,
	simpleBar2Unused: SimpleBarTimerRenderer2,
}

export { TimerDetails, TimerRenderer, ALL_RENDERERS }
