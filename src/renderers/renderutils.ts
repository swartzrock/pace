import { Xterm256 } from '../common/colors'

class RenderUtils {
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

export { RenderUtils }
