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
		const figletMatrix = StringMatrix.createFromMultilineMonoString(figletText)
		if (doubleText && figletMatrix.cols() * 2 < matrix.cols()) {
			figletMatrix.double()
		}

		// render the time-remaining shadow
		const matrixShadow = figletMatrix.clone()
		matrixShadow.replaceAll(UnicodeChars.BLOCK_FULL, shadowChar)
		matrix.overlayCentered(matrixShadow, undefined, true, shadowOffset)

		// render the time-remaining text
		figletMatrix.replaceAll(UnicodeChars.BLOCK_FULL, fillChar)
		figletMatrix.setVerticalGradient(gradient)
		matrix.overlayCentered(figletMatrix)
	}


}

export {TextEffects}
