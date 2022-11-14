import {Colors} from '../common/colors'
import {StringMatrix} from '../common/stringmatrix'
import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {UnicodeChars} from "../common/unicodechars";
import {Utils} from "../common/utils";
import {XtermGradients} from "../common/xtermgradients";
import {Rectangle} from "../common/rectangle";

/**
 * A lava-lamp (or "plasma") renderer.
 * "Inspired" by Slawomir Chodnicki's excellent article: https://towardsdatascience.com/fun-with-html-canvas-lets-make-lava-lamp-plasma-e4b0d89fe778
 */
class Lava implements TimerRenderer {

	private readonly MAP_SIZE = 800
	private readonly MAP_STRETCH = (3 * Math.PI) / (this.MAP_SIZE / 2)
	private readonly MATRIX_TERMINAL_PCT = new Point(0.75, 0.6)
	private readonly LAVA_GRADIENT_ITERATIONS = 200
	private readonly LAVA_GRADIENT_MULTIPLE = 7
	private readonly LAVA_CHAR = UnicodeChars.QUARTER_CIRCLE

	private lavaGradient: Array<number> = []

	// Height map from 0 to 1
	private heightMap1: Array<number> = []
	private heightMap1Origin = new Point(0, 0)

	// Height map from 0 to 1
	private heightMap2: Array<number> = []
	private heightMap2Origin = new Point(0, 0)

	render(details: TimerDetails, terminalDims: Point): StringMatrix {

		this.initLavaGradient(details.iteration)
		this.initHeightMaps()
		this.moveHeightMapOrigins()

		const matrixCols = Math.floor(terminalDims.col * this.MATRIX_TERMINAL_PCT.col)
		const matrixRows = Math.floor(terminalDims.row * this.MATRIX_TERMINAL_PCT.row)
		const matrix = StringMatrix.createUniformMatrix(matrixCols, matrixRows)
		for (let row = 0; row < matrix.rows(); row++) {
			for (let col = 0; col < matrix.cols(); col++) {
				const heightMap1Index = (row + this.heightMap1Origin.row) * this.MAP_SIZE + (col + this.heightMap1Origin.col)
				const heightMap2Index = (row + this.heightMap2Origin.row) * this.MAP_SIZE + (col + this.heightMap2Origin.col)
				const combinedHeight = this.heightMap1[heightMap1Index] + this.heightMap2[heightMap2Index]
				const gradientIndex = Math.floor(combinedHeight * this.lavaGradient.length * this.LAVA_GRADIENT_MULTIPLE)
				const fgColor = Utils.getModulusNonEmpty(this.lavaGradient, gradientIndex)
				const fg = Colors.foregroundColor(this.LAVA_CHAR, fgColor)
				matrix.setCell(fg, col, row)
			}
		}

		matrix.pad(new Rectangle(2, 2, 2, 2))
		const boxRect = new Rectangle(0,0,matrix.cols() - 1,matrix.rows() - 1		)
		matrix.addDoubleLineBox(boxRect, TimerRenderer.getGreenYellowRedColor(details.percentDone()))
		const timeRemainingText = ` ${details.timeRemainingText()} remaining `
		matrix.setHorizontallyCenteredMonochromeString(timeRemainingText, 0)

		return matrix
	}

	/**
	 * Every LAVA_GRADIENT_ITERATIONS iterations (or when starting the renderer)
	 * pick a new double color gradient at random and `concatReversed` it.
	 * @param iteration the current timer iteration
	 */
	initLavaGradient(iteration: number) {
		if (this.lavaGradient.length > 0 && iteration % this.LAVA_GRADIENT_ITERATIONS != 0) return

		const allGradients = Object.values(XtermGradients.DOUBLE_COLOR_GRADIENTS)
		const startingGradient = Utils.randomElementNonEmpty(allGradients)
		this.lavaGradient = Utils.concatReversed(startingGradient)
	}

	/**
	 * Select new sampling points for the height maps using the current epoch time
	 */
	moveHeightMapOrigins() {
		const seedX = Date.now() * 0.0002
		const seedY = Date.now() * 0.0003

		this.heightMap1Origin.col = Math.floor((((Math.cos(seedX + 0.4 + Math.PI) + 1) / 2) * this.MAP_SIZE) / 2)
		this.heightMap1Origin.row = Math.floor((((Math.cos(seedY - 0.1) + 1) / 2) * this.MAP_SIZE) / 2)

		this.heightMap2Origin.col = Math.floor((((Math.cos(0 - seedX + 1.2) + 1) / 2) * this.MAP_SIZE) / 2)
		this.heightMap2Origin.row = Math.floor((((Math.cos(0 - seedY - 0.8 + Math.PI) + 1) / 2) * this.MAP_SIZE) / 2)
	}

	/**
	 * Initialize the height maps with sine / cosine functions
	 */
	initHeightMaps() {

		const distanceFromOrigin = (p: Point) => Math.sqrt(p.row * p.row + p.col * p.col)

		if (this.heightMap1.length > 0 && this.heightMap2.length > 0) return

		for (let row = 0; row < this.MAP_SIZE; row++) {
			for (let col = 0; col < this.MAP_SIZE; col++) {
				const centeredPoint = new Point(col - this.MAP_SIZE / 2, row - this.MAP_SIZE / 2 )
				this.heightMap1[row * this.MAP_SIZE + col] = (Math.sin(distanceFromOrigin(centeredPoint) * this.MAP_STRETCH) + 1) / 2
			}
		}

		for (let row = 0; row < this.MAP_SIZE; row++) {
			for (let col = 0; col < this.MAP_SIZE; col++) {
				const centeredPoint = new Point(col - this.MAP_SIZE / 2, row - this.MAP_SIZE / 2 )
				const skewedDistance1 = distanceFromOrigin(new Point(centeredPoint.col * 0.8, centeredPoint.row * 1.3)) * 0.022
				const skewedDistance2 = distanceFromOrigin(new Point(centeredPoint.col * 1.35, centeredPoint.row * 0.45)) * 0.022
				this.heightMap2[row * this.MAP_SIZE + col] = (Math.sin(skewedDistance1) + Math.cos(skewedDistance2) + 2) / 4
			}
		}

	}



}

export {Lava}
