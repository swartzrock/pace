import { Command } from '@oclif/core'
import { FigletFonts, Fonts } from '../../common/fonts'
import { Colors, Xterm256 } from '../../common/colors'
import { XtermGradients } from '../../common/xtermgradients'
import { TextBlocks } from '../../common/textblocks'

export default class AllFonts extends Command {
	static description = 'Displays all Figlet Fonts with the given input'

	static examples = [
		`pace allfonts
`,
	]

	static flags = {}
	static args = []
	static strict = true

	readonly CYAN_GREEN_PALETTE: Xterm256[] = [
		Xterm256.CYAN_1,
		Xterm256.CYAN_2,
		Xterm256.MEDIUMSPRINGGREEN,
		Xterm256.SPRINGGREEN_1,
		Xterm256.SPRINGGREEN_2B,
		Xterm256.GREEN_1,
	]

	async run(): Promise<void> {
		const text = '23 Quick foxes'
		const gradient = XtermGradients.SINGLE_COLOR_GRADIENTS.GREEN_1_TO_CYAN_1

		const figFontNames: string[] = <FigletFonts[]>Object.keys(FigletFonts)
		const figFontValues: FigletFonts[] = <FigletFonts[]>Object.values(FigletFonts)
		for (let i = 0; i < figFontNames.length; i++) {
			const maxDigitWidth = this.maxDigitWidth(figFontValues[i])
			console.log(`:: ${figFontNames[i]} (55:55 = ${maxDigitWidth} chars) ::`)
			console.log(Colors.setVerticalGradient(Fonts.render(figFontValues[i], text), gradient))
			console.log()
		}
	}

	maxDigitWidth(font: FigletFonts): number {
		let maxWidth = 0
		for (let i = 0; i < 10; i++) {
			const text = `${i}${i}:${i}${i}`
			const digitWidth = TextBlocks.maxRowWidth(Fonts.render(font, text))
			maxWidth = Math.max(maxWidth, digitWidth)
		}
		return maxWidth
	}
}
