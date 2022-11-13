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
import {XtermGradients} from "../common/xtermgradients";
import {Lava} from "./lava";

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
		const index = this.getGreenYellowRedIndex(percentDone)
		return [Xterm256.GREEN_1, Xterm256.GREENYELLOW, Xterm256.RED_1][index]
	}

	static getGreenYellowRedGradient(percentDone: number): Array<Xterm256> {
		const index = this.getGreenYellowRedIndex(percentDone)
		return [
			XtermGradients.SINGLE_COLOR_GRADIENTS.GREEN_3A_TO_DEEPSKYBLUE_1,
			XtermGradients.SINGLE_COLOR_GRADIENTS.YELLOW_3B_TO_LIGHTSTEELBLUE_1,
			XtermGradients.SINGLE_COLOR_GRADIENTS.RED_3B_TO_MAGENTA_2A
		][index]
	}

	private static getGreenYellowRedIndex(percentDone: number): number {
		if (percentDone > 0.9) return 2
		if (percentDone > 0.7) return 1
		return 0
	}
}

class RendererInfo {
	constructor(public name: string, public renderer: TimerRenderer) {}
}

class AllRenderers {
	static pie: TimerRenderer = new Pie()
	static bar: TimerRenderer = new Bar()

	static bigtext: TimerRenderer = new BigText()
	static circles: TimerRenderer = new Circles()
	static colorwheel: TimerRenderer = new ColorWheel()
	static colossal: TimerRenderer = new Colossal()
	static dots: TimerRenderer = new Dots()
	static lava: TimerRenderer = new Lava()
	static shuffle: TimerRenderer = new Shuffle()
	static sine: TimerRenderer = new Sine()
	static slant: TimerRenderer = new Slant()
	static sweep: TimerRenderer = new Sweep()

	static renderers: Array<RendererInfo> = Object.entries(AllRenderers).map((a) => new RendererInfo(a[0], a[1]))
}

export { TimerRenderer, RendererInfo, AllRenderers }
