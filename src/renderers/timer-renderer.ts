import { Bar } from './bar'
import { PieChart } from './pie'
import { StringMatrix } from '../common/stringmatrix'
import { Circles } from './circles'
import { Colossal } from './colossal'
import { Slant } from './slant'

class TimerDetails {
	constructor(
		public iteration: number,
		public totalIterations: number,
		public elapsedSeconds: number,
		public remainingSeconds: number
	) {}

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

interface TimerRenderer {
	render(details: TimerDetails): StringMatrix
}

const ALL_RENDERERS = {
	pie: PieChart,
	bar: Bar,
	circles: Circles,
	colossal: Colossal,
	slant: Slant,
}

export { TimerDetails, TimerRenderer, ALL_RENDERERS }
