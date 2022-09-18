import { Command } from '@oclif/core'
import { Colors, Xterm256 } from '../../common/colors'
import { stdout } from 'process'
import { Utils } from '../../common/utils'
import { StringUtils } from '../../common/stringutils'
import { XtermColorGradients } from '../../common/xtermcolorgradients'
import { FigletFonts, Fonts } from '../../common/fonts'

export default class ColorBlocks extends Command {
	static description = 'Displays an xterm color block pattern'

	static examples = [
		`pace colorblocks
`,
	]

	static flags = {}
	static args = []
	static strict = true

	async run(): Promise<void> {
		this.displayAllGradients()
		this.displayAllPalettes()
	}

	getColorBlock(color: Xterm256): string {
		const BLOCK_WIDTH = 22
		const colorName = Colors.colorName(color)
		const fgColor = Colors.contrastColor(color)
		const fgColorText = `${colorName} `.padEnd(BLOCK_WIDTH, ' ')
		return Colors.foregroundAndBackgroundColor(fgColorText, fgColor, color)
	}

	displayPalette(palette: Xterm256[][]) {
		for (const row of palette) {
			for (const cell of row) {
				const block = this.getColorBlock(cell)
				stdout.write(block + ' ')
			}
			console.log('')
		}
	}

	renderGradientToDescAndBlocks(row: Xterm256[], width: number): string[] {
		const colorBlockTxt = StringUtils.fillString(' ', width)
		const startColorName = Colors.colorName(row[0])
		const endColorName = Colors.colorName(row[row.length - 1])
		const colorBlocks = row.map((c) => Colors.backgroundColor(colorBlockTxt, c)).join('')
		return [`[Xterm256.${startColorName}, Xterm256.${endColorName}]`, `${colorBlocks}`]
	}

	displayGradients(gradients: Xterm256[][]) {
		const headings: string[][] = [
			['START & END COLORS', 'GRADIENT'],
			['==================', '========'],
		]
		const width = gradients[0].length == 12 ? 6 : 12
		const matrix: string[][] = gradients.map((g) => this.renderGradientToDescAndBlocks(g, width))
		headings.push(...matrix)
		const combinedText = StringUtils.renderAlignedColumns(headings, 2)
		console.log(combinedText)
	}

	displayAllGradients() {
		const singleTitleGradient = XtermColorGradients.singleColorGradientOrExit(Xterm256.GREEN_1, Xterm256.CYAN_1)
		const doubleGradient = XtermColorGradients.doubleColorGradientOrExit(Xterm256.PURPLEA, Xterm256.PURPLEB)

		console.log('')
		console.log('')
		console.log(
			Colors.setVerticalGradient(Fonts.render(FigletFonts.ANSI_REGULAR, 'Color Gradients'), doubleGradient) + '\n'
		)

		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'SINGLE COLOR GRADIENTS'),
				singleTitleGradient
			) + '\n'
		)

		this.displayGradients(XtermColorGradients.SINGLE_COLOR_GRADIENTS.map((g) => g.get()))

		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'DOUBLE COLOR GRADIENTS'),
				singleTitleGradient
			) + '\n'
		)

		this.displayGradients(XtermColorGradients.DOUBLE_COLOR_GRADIENTS.map((g) => g.get()))
	}

	displayAllPalettes() {
		// ANSI_REGULAR

		const singleTitleGradient = XtermColorGradients.singleColorGradientOrExit(Xterm256.GREEN_1, Xterm256.CYAN_1)
		const doubleGradient = XtermColorGradients.doubleColorGradientOrExit(Xterm256.PURPLEA, Xterm256.PURPLEB)

		console.log('\n\n\n')
		console.log(
			Colors.setVerticalGradient(Fonts.render(FigletFonts.ANSI_REGULAR, 'Color Palettes'), doubleGradient) + '\n'
		)

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'BLUE-GREEN PALETTE'),
				singleTitleGradient
			)
		)
		console.log('')

		this.displayPalette(Utils.transpose(XtermColorGradients.BLUE_GREEN_PALETTE))

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'PURPLE-GREEN PALETTE'),
				singleTitleGradient
			)
		)
		console.log('')

		this.displayPalette(Utils.transpose(XtermColorGradients.PURPLE_GREEN_PALETTE))

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'RED-YELLOW PALETTE'),
				singleTitleGradient
			)
		)
		console.log('')

		this.displayPalette(Utils.transpose(XtermColorGradients.RED_YELLOW_PALETTE))

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'MONOCHROME PALETTE'),
				singleTitleGradient
			)
		)
		console.log('')

		const monochromePalette = Utils.grouped(XtermColorGradients.MONOCHROME_GRADIENT, 6)
		this.displayPalette(monochromePalette)

		console.log('\n')
	}
}
