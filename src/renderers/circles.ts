import {Colors, Xterm256} from '../common/colors'
import {StringMatrix} from '../common/stringmatrix'
import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {Utils} from "../common/utils";
import {XtermGradients} from "../common/xtermgradients";
import {Rectangle} from "../common/rectangle";

class CircleInfo {
	public constructor(public origin: Point, public radius: number = 5, public color: Xterm256, public increment: Point) {}
	toString(): string {
		return `CircleInfo(${this.origin}, ${this.radius}, ${this.color}, ${this.increment})`
	}
}

class Circles implements TimerRenderer {

	private readonly BACKGROUND_DOT_COLOR = Xterm256.GREY_007

	private readonly CIRCLE_COLORS = [Xterm256.DARKBLUE, Xterm256.DARKRED_B, Xterm256.GREEN_4, Xterm256.DARKVIOLETA, Xterm256.DARKORANGE_3B, Xterm256.CHARTREUSE_1, Xterm256.CYAN_2]
	private readonly FADE_TO_BLACK = Utils.fill(this.BACKGROUND_DOT_COLOR, 5).concat(XtermGradients.MONOCHROME_GRADIENT.slice(2, 10))
	private readonly CIRCLE_ITERATIONS = 200
	private readonly INCREMENTS = [-2, -1, 1, 2]
	private readonly MIN_CIRCLE_SIZE = 5
	private readonly MAX_CIRCLE_SIZE = 10
	private readonly HORIZ_MARGIN = 0
	private readonly VERT_MARGIN = 10

	private circleInfos: Array<CircleInfo> = []

	/**
	 * Entrypoint - renders to a StringMatrix for later printing to the console
	 * @param details information about the current timer in-progress
	 * @param terminalDims the current terminal dimensions
	 */
	render(details: TimerDetails, terminalDims: Point): StringMatrix {

		const bg = Colors.foregroundColor('.', this.BACKGROUND_DOT_COLOR)
		const matrix = StringMatrix.createUniformMatrix(terminalDims.col - this.HORIZ_MARGIN, terminalDims.row - this.VERT_MARGIN, bg)


		const remaining = this.CIRCLE_ITERATIONS - (details.iteration % this.CIRCLE_ITERATIONS)
		if (remaining < this.FADE_TO_BLACK.length) {
			for (let i = 0; i < this.circleInfos.length; i++) {
				this.circleInfos[i].color = this.FADE_TO_BLACK[remaining]
			}
		}

		if (this.circleInfos.length == 0 || details.iteration % this.CIRCLE_ITERATIONS == 0) {
			this.generateCircles(terminalDims)
		}


		for (let i = 0; i < this.circleInfos.length; i++) {
			const info = this.circleInfos[i]
			info.origin.plus(info.increment)
			Circles.fixOutOfBounds(matrix.bounds(), info)

			const pieChartMatrix = StringMatrix.createCircleMatrix(info.radius, Colors.foregroundColor('.', info.color), ' ')
			const circleTopLeft = new Point(
				info.origin.col - Utils.halfInt(pieChartMatrix.cols()),
				info.origin.row - Utils.halfInt(pieChartMatrix.rows()),
			)
			matrix.overlayAt(pieChartMatrix, circleTopLeft)
		}

		return matrix
	}

	private generateCircles(terminalDims: Point) {

		this.circleInfos = new Array<CircleInfo>()
		for (let i = 0; i < this.CIRCLE_COLORS.length; i++) {
			this.circleInfos.push(new CircleInfo(
				new Point(Utils.randomInt(0, terminalDims.col), Utils.randomInt(0, terminalDims.row)),
				Utils.randomInt(this.MIN_CIRCLE_SIZE, this.MAX_CIRCLE_SIZE),
				this.CIRCLE_COLORS[i],
				new Point(Utils.randomElementNonEmpty(this.INCREMENTS), Utils.randomElementNonEmpty(this.INCREMENTS))
			))
		}

	}

	private static fixOutOfBounds(bounds: Rectangle, info: CircleInfo) {
		if (info.origin.col < bounds.left) {
			info.origin.col = bounds.left
			info.increment.col = 0 - info.increment.col
		}
		if (info.origin.col > bounds.right) {
			info.origin.col = bounds.right
			info.increment.col = 0 - info.increment.col
		}
		if (info.origin.row < bounds.top) {
			info.origin.row = bounds.top
			info.increment.row = 0 - info.increment.row
		}
		if (info.origin.row > bounds.bottom) {
			info.origin.row = bounds.bottom
			info.increment.row = 0 - info.increment.row
		}
	}



}

export { Circles }
