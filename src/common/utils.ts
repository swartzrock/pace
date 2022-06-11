import { Colors } from './colors'

class Utils {
	static readonly NEWLINE: string = '\n'

	static createArrayRange(start: number, end: number): number[] {
		const total = end - start + 1
		return Array.from(Array(total)).map((_, i) => start + i)
	}

	static horizDoubleTextBlock(s: string): string {
		const lines = Utils.toLines(s)
		const widenedLines = lines.map((line) => [...line].map((c) => c + c).join(''))
		return Utils.toMultilineBlock(widenedLines)
	}

	// static evenFloor = (i: number): number => Math.floor(i / 2) * 2
	static fillString = (fill: string, length: number): string => ''.padStart(length, fill)
	static toLines = (s: string): string[] => s.split(Utils.NEWLINE)
	static toMultilineBlock = (a: string[]): string => a.join(Utils.NEWLINE)
	static halfInt = (n: number): number => Math.floor(n / 2)
	static firstPrintableChar = (s: string): number => s.search(/\S/)
	static containsPrintableChar = (s: string): boolean => Utils.firstPrintableChar(s) != -1
	static reverse = (s: string): string => s.split('').reverse().join('')

	static setTextBlockPadding(input: string, horiz: number, vert: number, padChar: string): string {
		const trimmed = Utils.trimToContent(input)
		return Utils.padTextBlock(trimmed, horiz, vert, padChar)
	}

	static padTextBlock(input: string, horiz: number, vert: number, padChar: string): string {
		const lines = Utils.toLines(input)
		const horizPaddingFill = Utils.fillString(padChar, horiz)
		const horizPaddedLines = lines.map((line) => horizPaddingFill + line + horizPaddingFill)
		const paddedWidth = horizPaddedLines[0].length

		const vertPaddingFill = Utils.fillString(padChar, paddedWidth)
		const vertPadding = new Array<string>(vert).fill(vertPaddingFill)

		return Utils.toMultilineBlock(vertPadding.concat(horizPaddedLines, vertPadding))
	}

	// Trim a text block down to its content, removing padding rows & columns of whitespace
	static trimToContent(s: string): string {
		let lines = Utils.toLines(s)
		let firstPrintableRow = -1
		for (let i = 0; i < lines.length; ++i) {
			if (Utils.containsPrintableChar(lines[i])) {
				firstPrintableRow = i
				break
			}
		}
		if (firstPrintableRow == -1) return ''

		let lastPrintableRow = -1
		for (let i = lines.length - 1; i >= firstPrintableRow; --i) {
			if (Utils.containsPrintableChar(lines[i])) {
				lastPrintableRow = i
				break
			}
		}

		lines = lines.slice(firstPrintableRow, lastPrintableRow + 1)

		const firstPrintableCols: number[] = lines.map((line) => Utils.firstPrintableChar(line))
		const firstPrintableCol = Math.min(...firstPrintableCols)

		const lastPrintableCols: number[] = lines.map((line) => line.length - Utils.firstPrintableChar(this.reverse(line)))
		const lastPrintableCol = Math.max(...lastPrintableCols)

		lines = lines.map((line: string) => line.slice(firstPrintableCol, lastPrintableCol + 1))
		return lines.join(Utils.NEWLINE)
	}

	static centerTextBlockHorizontallyOnScreen(s: string): string {
		const lines = Utils.toLines(s)
		const horizPadding = Math.floor((process.stdout.columns - lines[0].length) / 2)
		return Utils.padTextBlock(s, horizPadding, 0, ' ')
	}

	// Divides the number in half. If odd, the larger half will be returned first
	// static halfsies(n: number): [number, number] {
	// 	const p1 = Math.floor(n / 2)
	// 	return [Math.floor(n) - p1, p1]
	// }

	static centerTextBlockInTextBlock(colorableForeground: string, background: string): string {
		const fgLines = Utils.toLines(colorableForeground)
		const fgWidth = Colors.strip(fgLines[0]).length
		const fgHeight = fgLines.length
		const bgLines = Utils.toLines(background)
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

		return Utils.toMultilineBlock(bgLines)
	}
}

export { Utils }
