import { Command } from '@oclif/core'
import { FigletFonts, Fonts } from '../../common/fonts'
import { Colors, Xterm256 } from '../../common/colors'
import { XtermColorGradients } from '../../common/xtermcolorgradients'

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
		const gradient = XtermColorGradients.singleColorGradientOrExit(Xterm256.GREEN_1, Xterm256.CYAN_1)

		const figFontKeys: FigletFonts[] = <FigletFonts[]>Object.keys(FigletFonts)
		const figFontValues: FigletFonts[] = <FigletFonts[]>Object.values(FigletFonts)
		for (let i = 0; i < figFontKeys.length; i++) {
			console.log(`:: ${figFontKeys[i]} ::`)
			console.log(Colors.setVerticalGradient(Fonts.render(figFontValues[i], text), gradient))
			console.log()
		}
	}
}
