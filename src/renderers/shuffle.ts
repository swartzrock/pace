import {StringMatrix} from '../common/stringmatrix'
import {AllRenderers, RendererInfo, TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {Timer} from "../commands/timer";

/**
 * todo show a vertical line fading from one renderer to the next
 */
class Shuffle implements TimerRenderer {
	readonly ITERATIONS_PER_RENDERER = 75

	/**
	 * This renderer displays a large countdown timer in the Colossal Figlet font
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {
		const renderers: Array<RendererInfo> = AllRenderers.renderers.filter((i) => i.name != 'shuffle')
		const index = Math.floor(details.iteration / this.ITERATIONS_PER_RENDERER) % renderers.length

		const INTERVALS_PER_SECOND = 1000 / Timer.TIMER_CALLBACK_INTERVAL_MS
		const remainingSeconds = Math.floor((this.ITERATIONS_PER_RENDERER - details.iteration % this.ITERATIONS_PER_RENDERER) / INTERVALS_PER_SECOND)
		const selected = renderers[index]
		if (remainingSeconds > 1) {
			details.statusBarMessage = `Shuffle: showing the "${selected.name}" renderer. ${remainingSeconds} seconds remaining.`
		} else {
			details.statusBarMessage = `Shuffle: loading the "${renderers[(index + 1) % renderers.length].name}" renderer...`
		}
		return selected.renderer.render(details, terminalDims)
	}
}

export { Shuffle }
