import {StringMatrix} from '../common/stringmatrix'
import {AllRenderers, RendererInfo, TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {Timer} from "../commands/timer";
import * as _ from 'lodash'

class Shuffle implements TimerRenderer {
	readonly ITERATIONS_PER_RENDERER = 100
	readonly SHOW_NEXT_RENDERER_PERCENT = 0.8

	renderers: Array<RendererInfo> = []

	/**
	 * Shuffle shuffles between the renderers, playing them for 10 seconds, plus a cross-fade effect.
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {

		if (this.renderers.length == 0) {
			this.renderers = _.shuffle(AllRenderers.renderers.filter((i) => i.name != 'shuffle'))
		}

		const currentIndex = Math.floor(details.iteration / this.ITERATIONS_PER_RENDERER) % this.renderers.length
		const nextIndex = (currentIndex + 1) % this.renderers.length

		const currentMatrix = this.renderers[currentIndex].renderer.render(details, terminalDims)
		currentMatrix.fitToWindow()

		const pctDone = (details.iteration % this.ITERATIONS_PER_RENDERER) / this.ITERATIONS_PER_RENDERER
		if (pctDone > this.SHOW_NEXT_RENDERER_PERCENT) {

			const nextPct = 1.0 - (1.0 - pctDone) / (1.0 - this.SHOW_NEXT_RENDERER_PERCENT)
			const nextColumns = nextPct * currentMatrix.cols()

			const nextMatrix = this.renderers[nextIndex].renderer.render(details, terminalDims)
			nextMatrix.fitToWindow()

			const cols = Math.min(nextColumns, nextMatrix.cols())
			const rows = Math.min(currentMatrix.rows(), nextMatrix.rows())
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					currentMatrix.setCell(nextMatrix.getCell(col, row), col, row)
				}
			}
		}

		const INTERVALS_PER_SECOND = 1000 / Timer.TIMER_CALLBACK_INTERVAL_MS
		const remainingSeconds = Math.floor((this.ITERATIONS_PER_RENDERER - details.iteration % this.ITERATIONS_PER_RENDERER) / INTERVALS_PER_SECOND)
		if (remainingSeconds > 1) {
			details.statusBarMessage = `Shuffle: showing the "${this.renderers[currentIndex].name}" renderer for ${remainingSeconds} more seconds...`
		} else {
			details.statusBarMessage = `Shuffle: loading the "${this.renderers[nextIndex].name}" renderer...`
		}

		return currentMatrix
	}
}

export { Shuffle }
