import { StringUtils } from './stringutils'
import { Rectangle } from './rectangle'

/**
 * A collection of utilities for working with multiline strings
 */
class TextBlocks {
	static horizontallyDouble(s: string): string {
		const lines = StringUtils.toLines(s)
		const widenedLines = lines.map((line) => [...line].map((c) => c + c).join(''))
		return StringUtils.toTextBlock(widenedLines)
	}

	static maxRowWidth = (s: string) => Math.max(...StringUtils.toLines(s).map((s1) => s1.length))

	static setPadding(input: string, horiz: number, vert: number, padChar: string): string {
		const trimmed = this.trimToContent(input)
		return this.addPadding(trimmed, horiz, vert, padChar)
	}

	static centerHorizontallyOnScreen(s: string): string {
		const lines = StringUtils.toLines(s)
		const horizPadding = Math.floor((process.stdout.columns - lines[0].length) / 2)
		return TextBlocks.addPadding(s, horizPadding, 0, ' ')
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

	static setAllPadding(input: string, padding: Rectangle, padChar: string): string {
		const trimmed = this.trimToContent(input)
		return this.addAllPadding(trimmed, padding, padChar)
	}

	static addAllPadding(input: string, padding: Rectangle, padChar: string): string {
		const lines = StringUtils.toLines(input)

		const leftFill = StringUtils.fillString(padChar, padding.left)
		const rightFill = StringUtils.fillString(padChar, padding.right)
		const horizPaddedLines = lines.map((line) => leftFill + line + rightFill)
		const paddedFirstLineWidth = horizPaddedLines[0].length

		const vertPaddingFill = StringUtils.fillString(padChar, paddedFirstLineWidth)
		const topPaddedLines = new Array<string>(padding.top).fill(vertPaddingFill)
		const bottomPaddedLines = new Array<string>(padding.bottom).fill(vertPaddingFill)

		return StringUtils.toTextBlock(topPaddedLines.concat(horizPaddedLines, bottomPaddedLines))
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

export { TextBlocks }
