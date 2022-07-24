import { StringUtils } from './stringutils'
import { Colors, Xterm256 } from './colors'
import { Utils } from './utils'

class StringMatrix {
	matrix: string[][]

	constructor(monochromeMultiLineString: string) {
		this.matrix = StringMatrix.multiLineStringtoString2dArray(monochromeMultiLineString)
	}

	toString = () => this.matrix.map((row) => row.join('')).join(StringUtils.NEWLINE)

	replaceAll(src: string, dest: string): void {
		for (const row of this.matrix) {
			for (let i = 0; i < row.length; i++) {
				if (row[i] === src) row[i] = dest
			}
		}
	}

	/**
	 * Overlay another matrix onto this one, centered. The overlay matrix may not be wider or taller than this matrix.
	 * @param overlay the matrix to overlay
	 */
	overlayCentered(overlay: StringMatrix) {
		const foreground = overlay.matrix
		const background = this.matrix

		const bgHeight = background.length
		const fgHeight = foreground.length
		if (bgHeight == 0 || fgHeight == 0 || bgHeight < fgHeight) {
			console.log(`copyOverCentered(), background must be taller than foreground and nonzero height`)
			return
		}

		const bgWidth = background[0].length
		const fgWidth = foreground[0].length
		if (bgWidth == 0 || fgWidth == 0 || bgWidth < fgWidth) {
			console.log('copyOverCentered(), background must be wider than foreground and nonzero height')
			return
		}

		const firstBgRow = Utils.halfInt(bgHeight) - Utils.halfInt(fgHeight)
		const firstBgCol = Utils.halfInt(bgWidth) - Utils.halfInt(fgWidth)

		for (let fgRow = 0; fgRow < fgHeight; fgRow++) {
			for (let fgCol = 0; fgCol < fgWidth; fgCol++) {
				background[fgRow + firstBgRow][fgCol + firstBgCol] = foreground[fgRow][fgCol]
			}
		}
	}

	setVerticalGradient(colors: Xterm256[], exactMatch?: string) {
		const a = this.matrix
		for (let row = 0; row < a.length; row++) {
			const rowColor = colors[Math.floor((row / a.length) * colors.length)]
			for (let col = 0; col < a[row].length; col++) {
				if (!exactMatch || exactMatch === a[row][col]) {
					a[row][col] = Colors.foregroundColor(a[row][col], rowColor)
				}
			}
		}
	}

	setVerticalGradientDithered(colors: Xterm256[], exactMatch?: string) {
		let prevColorIndex = 0
		const a = this.matrix
		const ditherChar = '\u2592'
		for (let row = 0; row < a.length; row++) {
			const colorIndex = Math.floor((row / a.length) * colors.length)
			const colorDitherChar = Colors.foregroundAndBackgroundColor(
				ditherChar,
				colors[Math.max(0, colorIndex - 1)],
				colors[colorIndex]
			)

			for (let col = 0; col < a[row].length; col++) {
				if (!exactMatch || exactMatch === a[row][col]) {
					if (colorIndex != prevColorIndex) {
						a[row][col] = colorDitherChar
					} else {
						a[row][col] = Colors.foregroundColor(a[row][col], colors[colorIndex])
					}
				}
			}

			if (colorIndex != prevColorIndex) {
				prevColorIndex = colorIndex
			}
		}
	}

	static toStringMatrix(a: string[][]): StringMatrix {
		return new StringMatrix(a.join('\n'))
	}

	private static multiLineStringtoString2dArray(s: string): string[][] {
		return StringUtils.toLines(s).map((line) => line.split(''))
	}
}

export { StringMatrix }
