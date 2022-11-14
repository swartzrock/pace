import {StringUtils} from './stringutils'
import {Colors, Xterm256} from './colors'
import {Utils} from './utils'
import {Rectangle} from './rectangle'
import {TextBlocks} from './textblocks'
import {Point} from './point'
import {UnicodeChars} from './unicodechars'
import {SquarePieChart, SquarePieChartDetails} from "./squarepiechart";
import * as _ from 'lodash'

/**
 * A drawing canvas for rendering ansi displays, wrapping a string[][]
 */
class StringMatrix {
	constructor(public matrix: string[][]) {}

	static createFromMultilineMonoString(s: string): StringMatrix {
		return new StringMatrix(TextBlocks.toString2dArray(s))
	}

	static createUniformMatrix(cols: number, rows: number, fillChar = ' '): StringMatrix {
		return new StringMatrix(Utils.fill(Utils.fill(fillChar, cols), rows))
	}

	public clone(): StringMatrix {
		return new StringMatrix(_.cloneDeep(this.matrix))
	}

	public toString = (): string => {
		return this.matrix.map((row) => row.join('')).join(StringUtils.NEWLINE)
	}

	rows = () => this.matrix.length
	cols = () => (this.matrix.length > 0 ? this.matrix[0].length : 0)
	size = () => new Point(this.cols(), this.rows())
	bounds = () => new Rectangle(0, 0, this.cols() - 1, this.rows() - 1)
	getCell = (col: number, row: number) => this.matrix[row][col]
	setCell = (s: string, col: number, row: number) => (this.matrix[row][col] = s)
	double = () => this.matrix = Utils.doubleMatrix(this.matrix)

	/**
	 * Overlay a monochrome string onto the matrix at the specified start location
	 * @param s the monochrome string
	 * @param start location
	 */
	setMonochromeString(s: string, start: Point) {
		const availableRoom = this.cols() - start.col
		s = s.substring(0, availableRoom)
		for (let i = 0; i < s.length; i++) {
			this.setCell(s.charAt(i), i + start.col, start.row)
		}
	}

	/**
	 * Overlay a monochrome string, colored with the foreground and background colors,
	 * onto the matrix at the specified start location
	 * @param s the monochrome string
	 * @param fg foreground color
	 * @param bg background color
	 * @param start location
	 */
	colorAndSetString(s: string, fg: Xterm256, bg: Xterm256, start: Point) {
		const availableRoom = this.cols() - start.col
		s = s.substring(0, availableRoom)
		for (let i = 0; i < s.length; i++) {
			this.setCell(Colors.foregroundAndBackgroundColor(s.charAt(i), fg, bg), i + start.col, start.row)
		}
	}

	/**
	 * Overlay a monochrome string onto the matrix, horizontally centered
	 * @param s the monochrome string
	 * @param row the row in which the place the string
	 */
	setHorizontallyCenteredMonochromeString(s: string, row: number) {
		const startCol = Math.floor(this.cols() / 2 - s.length / 2)
		this.setMonochromeString(s, new Point(startCol, row))
	}

	/**
	 * Replace all cells containing the src string with the des string
	 * @param src the string to replace
	 * @param dest the replacement string
	 */
	replaceAll(src: string, dest: string): void {
		for (const row of this.matrix) {
			for (let i = 0; i < row.length; i++) {
				if (row[i] === src) row[i] = dest
			}
		}
	}

	/**
	 * Overlay another matrix onto this one, centered.
	 * @param overlay the matrix to overlay
	 * @param transparentChar if specified, characters matching this char will not be copied
	 * @param retainColor if specified, the current color of this matrix will be retrained (requres overlay be monochromatic)
	 * @param offset  if specified, offset the centered matrix by this amount
	 */
	overlayCentered(overlay: StringMatrix, transparentChar = ' ', retainColor = false, offset = new Point(0, 0)) {
		const topLeft = new Point(
			Utils.halfInt(this.cols()) - Utils.halfInt(overlay.cols()) + offset.col,
			Utils.halfInt(this.rows()) - Utils.halfInt(overlay.rows()) + offset.row
		)

		this.overlayAt(overlay, topLeft, transparentChar, retainColor)
	}

	/**
	 * Overlay another matrix onto this one at the specified location.
	 * @param overlay the matrix to overlay
	 * @param topLeft the top-left corner on this matrix to overlay the other matrix
	 * @param transparentChar if specified, characters matching this char will not be copied
	 * @param retainColor if specified, the current color of this matrix will be retrained (requres overlay be monochromatic)
	 */
	overlayAt(overlay: StringMatrix, topLeft: Point, transparentChar = ' ', retainColor = false) {

		for (let fgRow = 0; fgRow < overlay.rows(); fgRow++) {
			for (let fgCol = 0; fgCol < overlay.cols(); fgCol++) {
				let overlayCell = overlay.getCell(fgCol, fgRow)
				if (overlayCell == transparentChar) {
					continue
				}

				const thisCol = fgCol + topLeft.col
				const thisRow = fgRow + topLeft.row
				if (!this.bounds().contains(new Point(thisCol, thisRow))) {
					continue
				}

				// If retaining color, detect the color of this matrix's cell and color the overlay cell
				if (retainColor) {
					const previousColorIndex = Colors.detectFgColor(
						this.getCell(thisCol, thisRow)
					)
					if (previousColorIndex != null) {
						overlayCell = Colors.foregroundColor(overlayCell, previousColorIndex)
					}
				}

				this.setCell(overlayCell, thisCol, thisRow)

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

	/**
	 * Draw a single-line (unicode) box on this matrix
	 * @param bounds the bounds of the box
	 * @param fg the foreground color of the box
	 */
	addSingleLineBox(bounds: Rectangle, fg: Xterm256): void {
		const topLeft = Colors.foregroundColor(UnicodeChars.SINGLE_BOX_DRAWING_TOP_LEFT, fg)
		const topRight = Colors.foregroundColor(UnicodeChars.SINGLE_BOX_DRAWING_TOP_RIGHT, fg)
		const bottomLeft = Colors.foregroundColor(UnicodeChars.SINGLE_BOX_DRAWING_BOTTOM_LEFT, fg)
		const bottomRight = Colors.foregroundColor(UnicodeChars.SINGLE_BOX_DRAWING_BOTTOM_RIGHT, fg)

		const horizontal = Colors.foregroundColor(UnicodeChars.SINGLE_BOX_DRAWING_HORIZONTAL, fg)
		const vertical = Colors.foregroundColor(UnicodeChars.SINGLE_BOX_DRAWING_VERTICAL, fg)

		this.fill(horizontal, new Rectangle(bounds.left, bounds.top, bounds.right, bounds.top))
		this.fill(horizontal, new Rectangle(bounds.left, bounds.bottom, bounds.right, bounds.bottom))
		this.fill(vertical, new Rectangle(bounds.left, bounds.top, bounds.left, bounds.bottom))
		this.fill(vertical, new Rectangle(bounds.right, bounds.top, bounds.right, bounds.bottom))

		this.setCell(topLeft, bounds.left, bounds.top)
		this.setCell(topRight, bounds.right, bounds.top)
		this.setCell(bottomLeft, bounds.left, bounds.bottom)
		this.setCell(bottomRight, bounds.right, bounds.bottom)
	}

	/**
	 * Draw a double-line (unicode) box on this matrix
	 * @param bounds the bounds of the box
	 * @param fg the foreground color of the box
	 */
	addDoubleLineBox(bounds: Rectangle, fg: Xterm256): void {
		const topLeft = Colors.foregroundColor(UnicodeChars.DOUBLE_BOX_DRAWING_TOP_LEFT, fg)
		const topRight = Colors.foregroundColor(UnicodeChars.DOUBLE_BOX_DRAWING_TOP_RIGHT, fg)
		const bottomLeft = Colors.foregroundColor(UnicodeChars.DOUBLE_BOX_DRAWING_BOTTOM_LEFT, fg)
		const bottomRight = Colors.foregroundColor(UnicodeChars.DOUBLE_BOX_DRAWING_BOTTOM_RIGHT, fg)

		const horizontal = Colors.foregroundColor(UnicodeChars.DOUBLE_BOX_DRAWING_HORIZONTAL, fg)
		const vertical = Colors.foregroundColor(UnicodeChars.DOUBLE_BOX_DRAWING_VERTICAL, fg)

		this.fill(horizontal, new Rectangle(bounds.left, bounds.top, bounds.right, bounds.top))
		this.fill(horizontal, new Rectangle(bounds.left, bounds.bottom, bounds.right, bounds.bottom))
		this.fill(vertical, new Rectangle(bounds.left, bounds.top, bounds.left, bounds.bottom))
		this.fill(vertical, new Rectangle(bounds.right, bounds.top, bounds.right, bounds.bottom))

		this.setCell(topLeft, bounds.left, bounds.top)
		this.setCell(topRight, bounds.right, bounds.top)
		this.setCell(bottomLeft, bounds.left, bounds.bottom)
		this.setCell(bottomRight, bounds.right, bounds.bottom)
	}

	/**
	 * Fill a rectangle in this matrix with the given string, replicated
	 * @param s the string with which to fill the rectangle
	 * @param r the bounds of the rectangle
	 */
	fill(s: string, r: Rectangle) {
		for (let row = r.top; row <= Math.min(this.rows() - 1, r.bottom); row++) {
			for (let col = r.left; col <= Math.min(this.cols() - 1, r.right); col++) {
				this.setCell(s, col, row)
			}
		}
	}

	addVertPadding(top: number, bottom: number, fillChar = ' ') {
		const topPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), top)
		const bottomPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), bottom)
		this.matrix = topPadding.concat(this.matrix, bottomPadding)
	}

	/**
	 * Add padding to the left of the matrix with the given fill char
	 * @param padding how many columns
	 * @param fillChar the fill character
	 */
	padLeft(padding: number, fillChar = ' ') {
		for (const row of this.matrix) {
			row.unshift(...Utils.fill(fillChar, padding))
		}
	}

	/**
	 * Add padding to the right of the matrix with the given fill char
	 * @param padding how many columns
	 * @param fillChar the fill character
	 */
	padRight(padding: number, fillChar = ' ') {
		for (const row of this.matrix) {
			row.push(...Utils.fill(fillChar, padding))
		}
	}

	/**
	 * Add padding to the top of the matrix with the given fill char
	 * @param padding how many rows
	 * @param fillChar the fill character
	 */
	padTop(padding: number, fillChar = ' ') {
		const topPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), padding)
		this.matrix = topPadding.concat(this.matrix)
	}

	/**
	 * Add padding to the bottom of the matrix with the given fill char
	 * @param padding how many rows
	 * @param fillChar the fill character
	 */
	padBottom(padding: number, fillChar = ' ') {
		const bottomPadding: string[][] = Utils.fill(Utils.fill(fillChar, this.cols()), padding)
		this.matrix = this.matrix.concat(bottomPadding)
	}

	/**
	 * Add padding to the matrix
	 * @param padding the padding dimensions as a rectangle
	 * @param fillChar the fill character
	 */
	pad(padding: Rectangle, fillChar = ' ') {
		this.padLeft(padding.left, fillChar)
		this.padTop(padding.top, fillChar)
		this.padRight(padding.right, fillChar)
		this.padBottom(padding.bottom, fillChar)
	}

	/**
	 * Resize the matrix to the specified width. If the new width is larger,
	 * the existing content will be centered.
	 * @param cols new width
	 * @param fillChar fill character
	 */
	fitToWidthCentered(cols: number, fillChar = ' ') {
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

	// fit the matrix to fit the current terminal window
	// Note: this does NOT work in tests
	fitToWindow(fillChar = ' ') {
		this.fitTo(process.stdout.columns, process.stdout.rows, fillChar)
	}

	/**
	 *
	 * @param cols
	 * @param rows
	 * @param fillChar
	 */
	fitTo(cols: number, rows: number, fillChar = ' ') {
		this.fitToWidthCentered(cols, fillChar)

		const diffRows = rows - this.rows()
		if (diffRows > 0) {
			const topMargin = Math.floor(diffRows / 2)
			const bottomMargin = diffRows - topMargin
			this.addVertPadding(topMargin, bottomMargin, fillChar)
		}
	}

	/**
	 * Returns a new matrix with a plotted circle
	 * @param radius
	 * @param fg
	 * @param bg
	 */
	static createCircleMatrix(radius: number, fg: string, bg: string): StringMatrix {
		const pieDetails: SquarePieChartDetails = {
			symbols: ['a'],
			percentages: [1.0],
		}

		const squarePieChartTxt = new SquarePieChart().generate(pieDetails, radius, bg, bg)
		const pieChartTxt = TextBlocks.horizontallyDouble(squarePieChartTxt)
		const pieChartMatrix = StringMatrix.createFromMultilineMonoString(pieChartTxt)
		pieChartMatrix.replaceAll('a', fg)
		return pieChartMatrix
	}

	rowString: (row: number) => string = (row: number) => this.matrix[row].join('')
}

export { StringMatrix }
