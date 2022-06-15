import { Colors, Xterm256 } from './colors'
import { Utils } from './utils'

class StringUtils {
	static readonly NEWLINE: string = '\n'

	static fillString = (fill: string, length: number): string => ''.padStart(length, fill)
	static toLines = (s: string): string[] => s.split(StringUtils.NEWLINE)
	static toTextBlock = (a: string[]): string => a.join(StringUtils.NEWLINE)
	static firstPrintableChar = (s: string): number => s.search(/\S/)
	static containsPrintableChar = (s: string): boolean => StringUtils.firstPrintableChar(s) != -1
	static reverse = (s: string): string => s.split('').reverse().join('')

	static setCharAt(s: string, c: string, i: number): string {
		if (i < 0 || i >= s.length) return s

		return s.slice(0, i) + c + s.slice(i + 1, s.length)
	}

	static centerTextBlockHorizontallyOnScreen(s: string): string {
		const lines = StringUtils.toLines(s)
		const horizPadding = Math.floor((process.stdout.columns - lines[0].length) / 2)
		return StringUtils.TextBlocks.addPadding(s, horizPadding, 0, ' ')
	}

	// Divides the number in half. If odd, the larger half will be returned first
	// static halfsies(n: number): [number, number] {
	// 	const p1 = Math.floor(n / 2)
	// 	return [Math.floor(n) - p1, p1]
	// }

	static centerTextBlockInTextBlock(colorableForeground: string, background: string): string {
		const fgLines = StringUtils.toLines(colorableForeground)
		const fgWidth = Colors.strip(fgLines[0]).length
		const fgHeight = fgLines.length
		const bgLines = StringUtils.toLines(background)
		const bgWidth = bgLines[0].length
		const bgHeight = bgLines.length

		if (fgWidth > bgWidth || fgHeight > bgHeight) {
			console.log("centerTextBlockInTextBlock, foreground can't be bigger than background")
			return background
		}

		const firstRow = Utils.halfInt(bgHeight) - Utils.halfInt(fgHeight)
		const firstCol = Utils.halfInt(bgWidth) - Utils.halfInt(fgWidth)

		for (let fgRow = 0; fgRow < fgHeight; fgRow++) {
			const bgRow = fgRow + firstRow
			const leftBackground = bgLines[bgRow].slice(0, firstCol)
			const centerForeground = fgLines[fgRow]
			const rightBackground = bgLines[bgRow].slice(firstCol + fgWidth, bgWidth)
			bgLines[bgRow] = leftBackground + centerForeground + rightBackground
		}

		return StringUtils.toTextBlock(bgLines)
	}

	static StringMatrix = class {
		// Copies the foreground into the background matrix, centered
		static addCenteredForeground(background: string[][], foreground: string[][]) {
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

		static setVerticalGradient(a: string[][], colors: Xterm256[], exactMatch?: string) {
			for (let row = 0; row < a.length; row++) {
				const rowColor = colors[Math.floor((row / a.length) * colors.length)]
				for (let col = 0; col < a[row].length; col++) {
					if (!exactMatch || exactMatch === a[row][col]) {
						a[row][col] = Colors.foregroundColor(a[row][col], rowColor)
					}
				}
			}
		}

		static setVerticalGradientDithered(a: string[][], colors: Xterm256[], exactMatch?: string) {
			let prevColorIndex = 0
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

		static toString(a: string[][]): string {
			return a.map((row) => row.join('')).join(StringUtils.NEWLINE)
		}

		static replaceAll(a: string[][], src: string, dest: string) {
			for (const row of a) {
				for (let i = 0; i < row.length; i++) {
					if (row[i] === src) row[i] = dest
				}
			}
		}
	}

	/**
	 * A Text Block is a multi-line string
	 */
	static TextBlocks = class {
		static horizontallyDouble(s: string): string {
			const lines = StringUtils.toLines(s)
			const widenedLines = lines.map((line) => [...line].map((c) => c + c).join(''))
			return StringUtils.toTextBlock(widenedLines)
		}

		static setPadding(input: string, horiz: number, vert: number, padChar: string): string {
			const trimmed = this.trimToContent(input)
			return this.addPadding(trimmed, horiz, vert, padChar)
		}
		static addPadding(input: string, horiz: number, vert: number, padChar: string): string {
			const lines = StringUtils.toLines(input)
			const horizPaddingFill = StringUtils.fillString(padChar, horiz)
			const horizPaddedLines = lines.map((line) => horizPaddingFill + line + horizPaddingFill)
			const paddedWidth = horizPaddedLines[0].length

			const vertPaddingFill = StringUtils.fillString(padChar, paddedWidth)
			const vertPadding = new Array<string>(vert).fill(vertPaddingFill)

			return StringUtils.toTextBlock(vertPadding.concat(horizPaddedLines, vertPadding))
		}
		static toString2dArray(s: string): string[][] {
			return StringUtils.toLines(s).map((line) => line.split(''))
		}

		static trimToContent(s: string): string {
			let lines = StringUtils.toLines(s)
			let firstPrintableRow = -1
			for (let i = 0; i < lines.length; ++i) {
				if (StringUtils.containsPrintableChar(lines[i])) {
					firstPrintableRow = i
					break
				}
			}
			if (firstPrintableRow == -1) return ''

			let lastPrintableRow = -1
			for (let i = lines.length - 1; i >= firstPrintableRow; --i) {
				if (StringUtils.containsPrintableChar(lines[i])) {
					lastPrintableRow = i
					break
				}
			}

			lines = lines.slice(firstPrintableRow, lastPrintableRow + 1)

			const firstPrintableCols: number[] = lines.map((line) => StringUtils.firstPrintableChar(line))
			const firstPrintableCol = Math.min(...firstPrintableCols)

			const lastPrintableCols: number[] = lines.map(
				(line) => line.length - StringUtils.firstPrintableChar(StringUtils.reverse(line))
			)
			const lastPrintableCol = Math.max(...lastPrintableCols)

			lines = lines.map((line: string) => line.slice(firstPrintableCol, lastPrintableCol + 1))
			return lines.join(StringUtils.NEWLINE)
		}
	}
}

export { StringUtils }
