import { Bar } from './bar'
import { Pie } from './pie'
import { StringMatrix } from '../common/stringmatrix'
import { Dots } from './dots'
import { Colossal } from './colossal'
import { Slant } from './slant'
import { ColorWheel } from './colorWheel'
import { Point } from '../common/point'
import { TimerDetails } from './timerDetails'
import { Xterm256 } from '../common/colors'
import { Sweep } from './sweep'
import { BigText } from './bigtext'
import { Shuffle } from './shuffle'
import {Sine} from "./sine";
import {Circles} from "./circles";

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

class RendererInfo {
	constructor(public name: string, public renderer: TimerRenderer) {}
}

class AllRenderers {
	static pie: TimerRenderer = new Pie()
	static bar: TimerRenderer = new Bar()

	static circles: TimerRenderer = new Circles()
	static dots: TimerRenderer = new Dots()
	static colossal: TimerRenderer = new Colossal()
	static slant: TimerRenderer = new Slant()
	static colorwheel: TimerRenderer = new ColorWheel()
	static sweep: TimerRenderer = new Sweep()
	static bigtext: TimerRenderer = new BigText()
	static sine: TimerRenderer = new Sine()
	static shuffle: TimerRenderer = new Shuffle()

	static renderers: Array<RendererInfo> = Object.entries(AllRenderers).map((a) => new RendererInfo(a[0], a[1]))
}

export { TimerRenderer, RendererInfo, AllRenderers }
