import { Colors } from './colors'
import { Utils } from './utils'

class StringUtils {
	static readonly NEWLINE: string = '\n'

	static horizDoubleTextBlock(s: string): string {
		const lines = StringUtils.toLines(s)
		const widenedLines = lines.map((line) => [...line].map((c) => c + c).join(''))
		return StringUtils.toMultilineBlock(widenedLines)
	}

	// static evenFloor = (i: number): number => Math.floor(i / 2) * 2
	static fillString = (fill: string, length: number): string => ''.padStart(length, fill)
	static toLines = (s: string): string[] => s.split(StringUtils.NEWLINE)
	static toMultilineBlock = (a: string[]): string => a.join(StringUtils.NEWLINE)
	static firstPrintableChar = (s: string): number => s.search(/\S/)
	static containsPrintableChar = (s: string): boolean => StringUtils.firstPrintableChar(s) != -1
	static reverse = (s: string): string => s.split('').reverse().join('')

	static setTextBlockPadding(input: string, horiz: number, vert: number, padChar: string): string {
		const trimmed = StringUtils.trimToContent(input)
		return StringUtils.padTextBlock(trimmed, horiz, vert, padChar)
	}

	static setCharAt(s: string, c: string, i: number): string {
		if (i < 0 || i >= s.length) return s

		return s.slice(0, i) + c + s.slice(i + 1, s.length)
	}

	static padTextBlock(input: string, horiz: number, vert: number, padChar: string): string {
		const lines = StringUtils.toLines(input)
		const horizPaddingFill = StringUtils.fillString(padChar, horiz)
		const horizPaddedLines = lines.map((line) => horizPaddingFill + line + horizPaddingFill)
		const paddedWidth = horizPaddedLines[0].length

		const vertPaddingFill = StringUtils.fillString(padChar, paddedWidth)
		const vertPadding = new Array<string>(vert).fill(vertPaddingFill)

		return StringUtils.toMultilineBlock(vertPadding.concat(horizPaddedLines, vertPadding))
	}

	// Trim a text block down to its content, removing padding rows & columns of whitespace
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
			(line) => line.length - StringUtils.firstPrintableChar(this.reverse(line))
		)
		const lastPrintableCol = Math.max(...lastPrintableCols)

		lines = lines.map((line: string) => line.slice(firstPrintableCol, lastPrintableCol + 1))
		return lines.join(StringUtils.NEWLINE)
	}

	static centerTextBlockHorizontallyOnScreen(s: string): string {
		const lines = StringUtils.toLines(s)
		const horizPadding = Math.floor((process.stdout.columns - lines[0].length) / 2)
		return StringUtils.padTextBlock(s, horizPadding, 0, ' ')
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

		return StringUtils.toMultilineBlock(bgLines)
	}
}

export { StringUtils }
