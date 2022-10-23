import {StringMatrix} from '../common/stringmatrix'
import {AllRenderers, RendererInfo, TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'

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
		const selected = renderers[index]
		details.statusBarMessage = `Shuffle: displaying "${selected.name}"`
		return selected.renderer.render(details, terminalDims)
	}
}

export { Shuffle }
