import { Utils } from './utils'

class StringUtils {
	static readonly NEWLINE: string = '\n'

	static fillString(fill: string, length: number): string {
		let buf = ''
		for (let i = 0; i < length; i++) {
			buf = buf + fill
		}
		return buf
	}

	static toLines = (s: string): string[] => s.split(StringUtils.NEWLINE)
	static toTextBlock = (a: string[]): string => a.join(StringUtils.NEWLINE)
	static firstPrintableChar = (s: string): number => s.search(/\S/)
	static containsPrintableChar = (s: string): boolean => StringUtils.firstPrintableChar(s) != -1
	static reverse = (s: string): string => s.split('').reverse().join('')

	static setCharAt(s: string, c: string, i: number): string {
		if (i < 0 || i >= s.length) return s

		return s.slice(0, i) + c + s.slice(i + 1, s.length)
	}

	static grouped(s: string, groupSize: number): string[] {
		const result = new Array<string>()
		for (let i = 0; i < s.length; i += groupSize) {
			result.push(s.substring(i, i + groupSize))
		}
		return result
	}

	static centered(s: string, length: number, fillChar: string): string {
		const leftPad = length / 2 - s.length / 2
		const rightPad = length - (leftPad + s.length)
		return StringUtils.fillString(fillChar, leftPad) + s + StringUtils.fillString(fillChar, rightPad)
	}

	static newlineWrapToScreen(s: string, rightMargin?: number): string {
		const actualRightMargin = rightMargin ?? 4
		const cols = process.stdout.columns - actualRightMargin
		return StringUtils.grouped(s, cols).join('\n')
	}

	static newlineWrapWithHorizMargin(s: string, width: number, horizMargin: number): string {
		const padding = StringUtils.fillString(' ', horizMargin)
		return StringUtils.grouped(s, width)
			.map((row) => padding + row + padding)
			.join('\n')
	}

	static newlineWrapWithMargins(
		s: string,
		width: number,
		top: number,
		left: number,
		bottom: number,
		right: number,
		marginChar?: string
	): string {
		const DEFAULT_MARGIN_CHAR = ' '
		marginChar = marginChar ?? DEFAULT_MARGIN_CHAR

		const leftPadding = marginChar.repeat(left)
		const rightPadding = marginChar.repeat(right)

		const fullWidth = left + width + right
		const verticalPaddingRow = StringUtils.fillString(marginChar, fullWidth)

		const topPadding: string[] = Utils.fill(verticalPaddingRow, top)
		const bottomPadding: string[] = Utils.fill(verticalPaddingRow, bottom)
		const horizPaddedRows: string[] = StringUtils.grouped(s, width).map((row) => leftPadding + row + rightPadding)

		return topPadding.concat(horizPaddedRows, bottomPadding).join(this.NEWLINE)
	}

	/**
	 * Return the real width of a string w/o color codes
	 * from [ansi-regex](https://github.com/chalk/ansi-regex)
	 * @param s the string to measure
	 */
	static realTextLength(s: string): number {
		const pattern = [
			'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
			'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
		].join('|')
		const regex = new RegExp(pattern, 'g')

		return s.replaceAll(regex, '').length
	}

	/**
	 * Render a matrix of text strings so the columns are aligned,
	 * with rows separated by newlines
	 * @param matrix text 2d array
	 * @param horizPaddingSpaces number of spaces between columns
	 */
	static renderAlignedColumns(matrix: string[][], horizPaddingSpaces: number): string {
		const columns = Math.min(...matrix.map((a) => a.length))

		const maxWidths = new Array<number>(columns)
		for (let col = 0; col < columns; col++) {
			maxWidths[col] = Math.max(...matrix.map((row) => this.realTextLength(row[col])))
		}

		let buf = ''
		for (const row of matrix) {
			for (let col = 0; col < columns; col++) {
				const spacing = maxWidths[col] - this.realTextLength(row[col]) + horizPaddingSpaces
				buf = buf + row[col] + this.fillString(' ', spacing)
			}
			buf = buf + '\n'
		}

		return buf
	}
}

export { StringUtils }
