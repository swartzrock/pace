import {Colors, Xterm256} from '../common/colors'
import {StringMatrix} from '../common/stringmatrix'
import {TimerRenderer} from './timerRenderer'
import {TimerDetails} from './timerDetails'
import {Point} from '../common/point'
import {UnicodeChars} from "../common/unicodechars";
import {Utils} from "../common/utils";
import {XtermGradients} from "../common/xtermgradients";
import {TextEffects} from "../common/textEffects";
import {Loggy} from "../common/loggy";

/**
 * A lava-lamp (or "plasma") renderer.
 * "Inspired" by Slawomir Chodnicki's excellent article: https://towardsdatascience.com/fun-with-html-canvas-lets-make-lava-lamp-plasma-e4b0d89fe778
 */
class Lava implements TimerRenderer {

	readonly TIME_REMAINING_GRADIENT: Xterm256[] = Utils.reverse(XtermGradients.SINGLE_COLOR_GRADIENTS.BLUE_1_TO_CYAN_1)
	readonly SHADOW_CHAR = Colors.foregroundColor(UnicodeChars.FULL_CIRCLE, Xterm256.GREY_000)
	readonly MAP_SIZE = 1024
	private readonly HORIZ_MARGIN = 10
	private readonly VERT_MARGIN = 10

	readonly GRADIENT = Utils.concatReversed(XtermGradients.DOUBLE_COLOR_GRADIENTS.BLUEVIOLET_TO_BLUE_1)

	heightMap1: Array<number> = []
	heightMap2: Array<number> = []

	dx1 = 0
	dy1 = 0
	dx2 = 0
	dy2 = 0

	moveHeightMaps() {
		const t = Date.now()

		this.dx1 = Math.floor(
			(((Math.cos(t * 0.0002 + 0.4 + Math.PI) + 1) / 2) * this.MAP_SIZE) / 2
		)
		this.dy1 = Math.floor((((Math.cos(t * 0.0003 - 0.1) + 1) / 2) * this.MAP_SIZE) / 2)
		this.dx2 = Math.floor((((Math.cos(t * -0.0002 + 1.2) + 1) / 2) * this.MAP_SIZE) / 2)
		this.dy2 = Math.floor(
			(((Math.cos(t * -0.0003 - 0.8 + Math.PI) + 1) / 2) * this.MAP_SIZE) / 2
		)
	}




	initHeightMaps() {

		const stretch = (3 * Math.PI) / (this.MAP_SIZE / 2)
		const distanceFromOrigin = (x: number, y: number) => Math.sqrt(x * x + y * y)

		if (this.heightMap1.length > 0 && this.heightMap2.length > 0) {
			Loggy.info("initHeightMaps, found existing, returning")
		}

		for (let u = 0; u < this.MAP_SIZE; u++) {
			for (let v = 0; v < this.MAP_SIZE; v++) {
				const cx = u - this.MAP_SIZE / 2;
				const cy = v - this.MAP_SIZE / 2;
				const d = distanceFromOrigin(cx, cy)
				const waveHeight = Math.sin(d * stretch)
				const normalizedWaveHeight = (waveHeight + 1) / 2
				this.heightMap1[u * this.MAP_SIZE + v] = Math.floor(normalizedWaveHeight * 128)
			}
		}

		for (let u = 0; u < this.MAP_SIZE; u++) {
			for (let v = 0; v < this.MAP_SIZE; v++) {
				const cx = u - this.MAP_SIZE / 2;
				const cy = v - this.MAP_SIZE / 2;

				// skewed distances
				const d1 = distanceFromOrigin(cx * 0.8, cy * 1.3) * 0.022
				const d2 = distanceFromOrigin(cx * 1.35, cy * 0.45) * 0.022

				const waveHeight = Math.sin(d1) + Math.cos(d2)
				const normalizedWaveHeight = (waveHeight + 2) / 4
				this.heightMap2[u * this.MAP_SIZE + v] = Math.floor(normalizedWaveHeight * 127)
			}
		}


	}


	render(details: TimerDetails, terminalDims: Point): StringMatrix {

		this.initHeightMaps()
		this.moveHeightMaps()


		const imgSize = 512
		const imageMatrix = StringMatrix.createUniformMatrix(imgSize, imgSize, ' ')
		for (let u = 0; u < imgSize; u++) {
			for (let v = 0; v < imgSize; v++) {
				const i = (u + this.dy1) * this.MAP_SIZE + (v + this.dx1)
				const k = (u + this.dy2) * this.MAP_SIZE + (v + this.dx2)

				const fgColor = Utils.getModulusNonEmpty(this.GRADIENT, this.heightMap1[i] + this.heightMap2[k])
				const fg = Colors.foregroundColor(UnicodeChars.BLOCK_FULL, fgColor)
				imageMatrix.setCell(fg, v, u)
			}
		}

		// const matrix = StringMatrix.createUniformMatrix(terminalDims.col, terminalDims.row, ' ')
		const matrix = StringMatrix.createUniformMatrix(terminalDims.col - this.HORIZ_MARGIN, terminalDims.row - this.VERT_MARGIN)
		matrix.overlayCentered(imageMatrix)
		TextEffects.renderShadowedText(details.timeRemainingText(), matrix, this.TIME_REMAINING_GRADIENT, UnicodeChars.BLOCK_FULL, this.SHADOW_CHAR)
		return matrix
	}


}

export {Lava}
