import {Xterm256} from './colors'
import {StringMatrix} from './stringmatrix'
import {Point} from './point'
import {FigletFonts, Fonts} from "./fonts";
import {TextBlocks} from "./textblocks";
import {UnicodeChars} from "./unicodechars";


/**
 * Utilities for rendering text on StringMatrix's
 */
class TextEffects {

	public static renderShadowedText(text: string, matrix: StringMatrix, gradient: Array<Xterm256>, fillChar: string, shadowChar: string, doubleText = true) {

		const shadowOffset = new Point(1, 1)
		let figletText = Fonts.render(FigletFonts.ANSI_REGULAR, text)
		figletText = TextBlocks.setPadding(figletText, 1, 1, ' ')

		// render the time-remaining shadow
		const matrixShadow = StringMatrix.createFromMultilineMonoString(figletText)
		if (doubleText) matrixShadow.double()
		matrixShadow.replaceAll(UnicodeChars.BLOCK_FULL, shadowChar)
		matrix.overlayCentered(matrixShadow, undefined, true, shadowOffset)

		// render the time-remaining text
		const matrixText = StringMatrix.createFromMultilineMonoString(figletText)
		if (doubleText) matrixText.double()
		matrixText.replaceAll(UnicodeChars.BLOCK_FULL, fillChar)
		matrixText.setVerticalGradient(gradient)
		matrix.overlayCentered(matrixText)
	}


}

export {TextEffects}
