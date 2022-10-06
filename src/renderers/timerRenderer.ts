import { Bar } from './bar'
import { PieChart } from './pie'
import { StringMatrix } from '../common/stringmatrix'
import { Circles } from './circles'
import { Colossal } from './colossal'
import { Slant } from './slant'
import { ColorWheel } from './colorWheel'
import { Point } from '../common/point'
import { TimerDetails } from './timerDetails'
import { Xterm256 } from '../common/colors'
import { Sweep } from './sweep'
import { BigText } from './bigtext'

abstract class TimerRenderer {
	/**
	 * Entrypoint - renders this pie chart to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	abstract render(details: TimerDetails, terminalDims: Point): StringMatrix

	/**
	 * Returns either green, yellow, or red depending on the percent done,
	 * to alert the user that the timer is ending shortly.
	 * @param percentDone the current timer progress
	 */
	static getGreenYellowRedColor(percentDone: number): Xterm256 {
		const GREEN_YELLOW_RED_COLORS = [Xterm256.GREEN_1, Xterm256.GREENYELLOW, Xterm256.RED_1]

		let index = 0
		if (percentDone > 0.9) {
			index = 2
		} else if (percentDone > 0.7) {
			index = 1
		}
		return GREEN_YELLOW_RED_COLORS[index]
	}
}

class AllRenderers {
	static pie: TimerRenderer = new PieChart()
	static bar: TimerRenderer = new Bar()

	static circles: TimerRenderer = new Circles()
	static colossal: TimerRenderer = new Colossal()
	static slant: TimerRenderer = new Slant()
	static colorwheel: TimerRenderer = new ColorWheel()
	static sweep: TimerRenderer = new Sweep()
	static bigtext: TimerRenderer = new BigText()
}

export { TimerRenderer, AllRenderers }
