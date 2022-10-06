import { Command } from '@oclif/core'
import { Colors, Xterm256 } from '../../common/colors'
import { stdout } from 'process'
import { Utils } from '../../common/utils'
import { StringUtils } from '../../common/stringutils'
import { XtermGradients } from '../../common/xtermgradients'
import { FigletFonts, Fonts } from '../../common/fonts'
import { MatrixGradient } from '../../common/matrixgradients'

class ColorBlocks extends Command {
	static description = 'Displays an xterm color block pattern'
	static examples = ['pace tools colorblocks']

	static flags = {}
	static args = []
	static strict = true

	static readonly H1_GRADIENT = XtermGradients.DOUBLE_COLOR_GRADIENTS.PURPLEB_TO_PURPLEA
	static readonly H2_GRADIENT = XtermGradients.SINGLE_COLOR_GRADIENTS.GREEN_1_TO_CYAN_1

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
		return [`${startColorName}_TO_${endColorName}`, `${colorBlocks}`]
	}

	displayGradients(gradients: Xterm256[][]) {
		const headings: string[][] = [
			['NAME', 'GRADIENT'],
			['====', '========'],
		]
		const width = gradients[0].length == 12 ? 6 : 12
		const matrix: string[][] = gradients.map((g) => this.renderGradientToDescAndBlocks(g, width))
		headings.push(...matrix)
		const combinedText = StringUtils.renderAlignedColumns(headings, 4)
		console.log(combinedText)
	}

	displayAllGradients() {
		console.log('')
		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.ANSI_REGULAR, 'Color Gradients'),
				ColorBlocks.H1_GRADIENT
			) + '\n'
		)

		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'SINGLE COLOR GRADIENTS'),
				ColorBlocks.H2_GRADIENT
			) + '\n'
		)

		this.displayGradients(Object.values(XtermGradients.SINGLE_COLOR_GRADIENTS))

		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'DOUBLE COLOR GRADIENTS'),
				ColorBlocks.H2_GRADIENT
			) + '\n'
		)

		this.displayGradients(Object.values(XtermGradients.DOUBLE_COLOR_GRADIENTS))
	}

	displayAllPalettes() {
		console.log('\n\n\n')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.ANSI_REGULAR, 'Color Palettes'),
				ColorBlocks.H1_GRADIENT
			) + '\n'
		)

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'BLUE-GREEN PALETTE'),
				ColorBlocks.H2_GRADIENT
			)
		)
		console.log('')

		this.displayPalette(Utils.transpose(MatrixGradient.BLUE_GREEN_PALETTE))

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'PURPLE-GREEN PALETTE'),
				ColorBlocks.H2_GRADIENT
			)
		)
		console.log('')

		this.displayPalette(Utils.transpose(MatrixGradient.PURPLE_GREEN_PALETTE))

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'RED-YELLOW PALETTE'),
				ColorBlocks.H2_GRADIENT
			)
		)
		console.log('')

		this.displayPalette(Utils.transpose(MatrixGradient.RED_YELLOW_PALETTE))

		console.log('')
		console.log(
			Colors.setVerticalGradient(
				Fonts.render(FigletFonts.JS_STICK_LETTERS, 'MONOCHROME PALETTE'),
				ColorBlocks.H2_GRADIENT
			)
		)
		console.log('')

		const monochromePalette = Utils.grouped(XtermGradients.MONOCHROME_GRADIENT, 6)
		this.displayPalette(monochromePalette)

		console.log('\n')
	}
}

export { ColorBlocks }
