import { Bar } from './bar'
import { PieChart } from './pie'
import { StringMatrix } from '../common/stringmatrix'
import { Circles } from './circles'

class TimerDetails {
	constructor(
		public start: Date,
		public end: Date,
		public percentDone: number,
		public iteration: number,
		public totalIterations: number,
		public remainingSeconds: number
	) {}
}

interface TimerRenderer {
	render(details: TimerDetails): StringMatrix
}

const ALL_RENDERERS = {
	pie: PieChart,
	bar: Bar,
	circles: Circles,
}

export { TimerDetails, TimerRenderer, ALL_RENDERERS }
