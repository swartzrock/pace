import { Bar } from './bar'
import { PieChart } from './pie'
import { StringMatrix } from '../common/stringmatrix'

class TimerDetails {
	constructor(public start: Date, public end: Date, public percentDone: number, public remainingSeconds: number) {}
}

interface TimerRenderer {
	render(details: TimerDetails): StringMatrix
}

const ALL_RENDERERS = {
	pie: PieChart,
	bar: Bar,
}

export { TimerDetails, TimerRenderer, ALL_RENDERERS }
