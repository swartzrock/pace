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

	timeRemainingText(): string {
		const remainingMinutes: number = Math.floor(this.remainingSeconds / 60)
		const remainingSecondsInMinute: number = this.remainingSeconds - remainingMinutes * 60
		return `${remainingMinutes}:` + `${remainingSecondsInMinute}`.padStart(2, '0')
	}
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
