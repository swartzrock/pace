import { StringUtils } from './stringutils'
import { Colors, Xterm256 } from './colors'
import { Utils } from './utils'
import { Rectangle } from './Rectangle'
import { TextBlocks } from './textblocks'

class StringMatrix {
	constructor(public matrix: string[][]) {}

	static fromMultilineMonochromeString(s: string): StringMatrix {
		return new StringMatrix(TextBlocks.toString2dArray(s))
	}

	static createUniformMatrix(cols: number, rows: number, fillChar: string): StringMatrix {
		const lines: string[] = []
		for (let i = 0; i < rows; i++) {
			lines.push(StringUtils.fillString(fillChar, cols))
		}
		const matrix: string[][] = lines.map((line) => line.split(''))
		return new StringMatrix(matrix)
	}

	toString = () => this.matrix.map((row) => row.join('')).join(StringUtils.NEWLINE)

	rows: () => number = () => this.matrix.length
	cols: () => number = () => (this.matrix.length > 0 ? this.matrix[0].length : 0)

	setCell(s: string, col: number, row: number) {
		this.matrix[row][col] = s
	}

	setMonochromeString(s: string, col: number, row: number) {
		const availableRoom = this.cols() - col
		s = s.substring(0, availableRoom)
		for (let i = 0; i < s.length; i++) {
			this.setCell(s.charAt(i), i + col, row)
		}
	}

	setStringWithColor(s: string, color: Xterm256, col: number, row: number) {
		const availableRoom = this.cols() - col
		s = s.substring(0, availableRoom)
		for (let i = 0; i < s.length; i++) {
			this.setCell(Colors.foregroundColor(s.charAt(i), color), i + col, row)
		}
	}

	setHorizontallyCenteredMonochromeString(s: string, row: number) {
		const startCol = this.cols() / 2 - s.length / 2
		this.setMonochromeString(s, startCol, row)
	}

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
	 * @param transparentChar if specific, characters matching this char will not be copied
	 */
	overlayCentered(overlay: StringMatrix, transparentChar?: string) {
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
				const fg = foreground[fgRow][fgCol]
				if (fg !== transparentChar) {
					background[fgRow + firstBgRow][fgCol + firstBgCol] = fg
				}
			}
		}
	}

	/**
	 * Sets the vertical gradient, skipping blank spaces
	 * @param colors the array of colors making up the gradient, applied first through last
	 */
	setVerticalGradient(colors: Xterm256[]) {
		const BLANK = ' '
		const a = this.matrix
		for (let row = 0; row < a.length; row++) {
			const rowColor = colors[Math.floor((row / a.length) * colors.length)]
			for (let col = 0; col < a[row].length; col++) {
				if (a[row][col] !== BLANK) {
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

	addDoubleLineBox(bounds: Rectangle, color: Xterm256): void {
		const DOUBLE_BOX_TOP_LEFT = '╔'
		const DOUBLE_BOX_TOP_RIGHT = '╗'
		const DOUBLE_BOX_BOTTOM_LEFT = '╚'
		const DOUBLE_BOX_BOTTOM_RIGHT = '╝'

		const DOUBLE_BOX_HORIZONTAL = '═'
		const DOUBLE_BOX_VERTICAL = '║'

		const topLeft = Colors.foregroundColor(DOUBLE_BOX_TOP_LEFT, color)
		const topRight = Colors.foregroundColor(DOUBLE_BOX_TOP_RIGHT, color)
		const bottomLeft = Colors.foregroundColor(DOUBLE_BOX_BOTTOM_LEFT, color)
		const bottomRight = Colors.foregroundColor(DOUBLE_BOX_BOTTOM_RIGHT, color)

		const horizontal = Colors.foregroundColor(DOUBLE_BOX_HORIZONTAL, color)
		const vertical = Colors.foregroundColor(DOUBLE_BOX_VERTICAL, color)

		for (let i = bounds.left; i < bounds.right; i++) {
			this.setCell(horizontal, i, bounds.top)
			this.setCell(horizontal, i, bounds.bottom)
		}
		for (let i = bounds.top; i < bounds.bottom; i++) {
			this.setCell(vertical, bounds.left, i)
			this.setCell(vertical, bounds.right, i)
		}
		this.setCell(topLeft, bounds.left, bounds.top)
		this.setCell(topRight, bounds.right, bounds.top)
		this.setCell(bottomLeft, bounds.left, bounds.bottom)
		this.setCell(bottomRight, bounds.right, bounds.bottom)
	}

	padLeft(padding: number, fillChar?: string) {
		fillChar ??= ' '
		for (const row of this.matrix) {
			row.unshift(...Utils.fill(fillChar, padding))
		}
	}

	padRight(padding: number, fillChar?: string) {
		fillChar ??= ' '
		for (const row of this.matrix) {
			row.push(...Utils.fill(fillChar, padding))
		}
	}

	padTop(padding: number, fillChar?: string) {
		fillChar ??= ' '
		const topPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), padding)
		this.matrix = topPadding.concat(this.matrix)
	}

	padBottom(padding: number, fillChar?: string) {
		fillChar ??= ' '
		const bottomPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), padding)
		this.matrix = this.matrix.concat(bottomPadding)
	}

	setWidthCentered(cols: number, fillChar?: string) {
		fillChar ??= ' '
		if (cols < this.cols()) {
			for (const row of this.matrix) {
				row.length = cols
			}
		} else if (cols > this.cols()) {
			const diff = cols - this.cols()
			const leftPadding = Math.floor(diff / 2)
			const rightPadding = diff - leftPadding
			this.padLeft(leftPadding, fillChar)
			this.padRight(rightPadding, fillChar)
		}
	}

	addVertPadding(top: number, bottom: number, fillChar?: string) {
		fillChar ??= ' '
		const topPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), top)
		const bottomPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), bottom)
		this.matrix = topPadding.concat(this.matrix, bottomPadding)
	}

	// fit the matrix to fit the current terminal window
	// Note: this does NOT work in tests
	fitToWindow(fillChar?: string) {
		const screenRowsCorrection = -3
		this.fitTo(process.stdout.columns, process.stdout.rows + screenRowsCorrection, fillChar)
	}

	fitTo(cols: number, rows: number, fillChar?: string) {
		fillChar ??= ' '
		this.setWidthCentered(cols, fillChar)

		const diffRows = rows - this.rows()
		const topMargin = Math.floor(diffRows / 2)
		const bottomMargin = diffRows - topMargin
		this.addVertPadding(topMargin, bottomMargin, fillChar)
	}

	rowString: (row: number) => string = (row: number) => this.matrix[row].join('')
}

export { StringMatrix }
