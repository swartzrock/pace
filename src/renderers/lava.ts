import {Colors, Xterm256} from '../common/colors'
import {StringMatrix} from '../common/stringmatrix'
import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {UnicodeChars} from "../common/unicodechars";
import {Utils} from "../common/utils";
import {XtermGradients} from "../common/xtermgradients";
import {TextEffects} from "../common/textEffects";

/**
 * A lava-lamp (or "plasma") renderer.
 * "Inspired" by Slawomir Chodnicki's excellent article: https://towardsdatascience.com/fun-with-html-canvas-lets-make-lava-lamp-plasma-e4b0d89fe778
 */
class Lava implements TimerRenderer {

	private readonly SHADOW_CHAR = Colors.foregroundColor(UnicodeChars.FULL_CIRCLE, Xterm256.GREY_000)
	private readonly MAP_SIZE = 800
	private readonly MAP_STRETCH = (3 * Math.PI) / (this.MAP_SIZE / 2)

	private readonly MATRIX_TERMINAL_PCT = new Point(0.75, 0.6)
	private readonly LAVA_GRADIENT_ITERATIONS = 200

	private lavaGradient: Array<number> = [] // Utils.concatReversed(XtermGradients.DOUBLE_COLOR_GRADIENTS.BLUEVIOLET_TO_BLUE_1)

	private heightMap1: Array<number> = []
	private heightMap1Origin = new Point(0, 0)

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
				const fgColor = Utils.getModulusNonEmpty(this.lavaGradient, this.heightMap1[heightMap1Index] + this.heightMap2[heightMap2Index])
				const fg = Colors.foregroundColor(UnicodeChars.BLOCK_FULL, fgColor)
				matrix.setCell(fg, col, row)
			}
		}

		const timeRemainingGradient = TimerRenderer.getGreenYellowRedGradient(details.percentDone())
		TextEffects.renderShadowedText(details.timeRemainingText(), matrix, timeRemainingGradient, UnicodeChars.BLOCK_FULL, this.SHADOW_CHAR)
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
		const time = Date.now()

		this.heightMap1Origin.col = Math.floor((((Math.cos(time * 0.0002 + 0.4 + Math.PI) + 1) / 2) * this.MAP_SIZE) / 2)
		this.heightMap1Origin.row = Math.floor((((Math.cos(time * 0.0003 - 0.1) + 1) / 2) * this.MAP_SIZE) / 2)

		this.heightMap2Origin.col = Math.floor((((Math.cos(time * -0.0002 + 1.2) + 1) / 2) * this.MAP_SIZE) / 2)
		this.heightMap2Origin.row = Math.floor((((Math.cos(time * -0.0003 - 0.8 + Math.PI) + 1) / 2) * this.MAP_SIZE) / 2)
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
				const waveHeight = Math.sin(distanceFromOrigin(centeredPoint) * this.MAP_STRETCH)
				const normalizedWaveHeight = (waveHeight + 1) / 2
				this.heightMap1[row * this.MAP_SIZE + col] = Math.floor(normalizedWaveHeight * 128)
			}
		}

		for (let row = 0; row < this.MAP_SIZE; row++) {
			for (let col = 0; col < this.MAP_SIZE; col++) {
				const centeredPoint = new Point(col - this.MAP_SIZE / 2, row - this.MAP_SIZE / 2 )
				const skewedDistance1 = distanceFromOrigin(new Point(centeredPoint.col * 0.8, centeredPoint.row * 1.3)) * 0.022
				const skewedDistance2 = distanceFromOrigin(new Point(centeredPoint.col * 1.35, centeredPoint.row * 0.45)) * 0.022
				const waveHeight = Math.sin(skewedDistance1) + Math.cos(skewedDistance2)
				const normalizedWaveHeight = (waveHeight + 2) / 4
				this.heightMap2[row * this.MAP_SIZE + col] = Math.floor(normalizedWaveHeight * this.MAP_SIZE / 4)
			}
		}


	}



}

export {Lava}
