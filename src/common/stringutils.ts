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

	// static centerTextBlockInTextBlock(colorableForeground: string, background: string): string {
	// 	const fgLines = StringUtils.toLines(colorableForeground)
	// 	const fgWidth = Colors.strip(fgLines[0]).length
	// 	const fgHeight = fgLines.length
	// 	const bgLines = StringUtils.toLines(background)
	// 	const bgWidth = bgLines[0].length
	// 	const bgHeight = bgLines.length
	//
	// 	if (fgWidth > bgWidth || fgHeight > bgHeight) {
	// 		console.log("centerTextBlockInTextBlock, foreground can't be bigger than background")
	// 		return background
	// 	}
	//
	// 	const firstRow = Utils.halfInt(bgHeight) - Utils.halfInt(fgHeight)
	// 	const firstCol = Utils.halfInt(bgWidth) - Utils.halfInt(fgWidth)
	//
	// 	for (let fgRow = 0; fgRow < fgHeight; fgRow++) {
	// 		const bgRow = fgRow + firstRow
	// 		const leftBackground = bgLines[bgRow].slice(0, firstCol)
	// 		const centerForeground = fgLines[fgRow]
	// 		const rightBackground = bgLines[bgRow].slice(firstCol + fgWidth, bgWidth)
	// 		bgLines[bgRow] = leftBackground + centerForeground + rightBackground
	// 	}
	//
	// 	return StringUtils.toTextBlock(bgLines)
	// }
}

export { StringUtils }
