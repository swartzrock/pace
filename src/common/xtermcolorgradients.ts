import { Xterm256 } from './colors'
import { Utils } from './utils'

enum MatrixStart {
	TOP,
	LEFT,
	BOTTOM,
	RIGHT,
}

/**
 * Defines a gradient portion of a color matrix
 * note: index is not checked for accuracy
 */
class MatrixGradient {
	constructor(public matrix: Xterm256[][], public start: MatrixStart, public index: number, public len: number) {}

	/**
	 * Returns the gradient as an array of colors
	 */
	get(): Xterm256[] {
		switch (this.start) {
			case MatrixStart.TOP:
				return Utils.transpose(this.matrix)[this.index].slice(0, this.len)
			case MatrixStart.LEFT:
				return this.matrix[this.index].slice(0, this.len)
			case MatrixStart.BOTTOM:
				return Utils.transpose(this.matrix)[this.index].reverse().slice(0, this.len)
			case MatrixStart.RIGHT:
				return this.matrix[this.index].reverse().slice(0, this.len)
		}
		return this.start
	}
}

class XtermColorGradients {
	static readonly BLUE_GREEN_PALETTE: Xterm256[][] = [
		[
			Xterm256.GREY_000,
			Xterm256.DARKGREEN,
			Xterm256.GREEN_4,
			Xterm256.GREEN_3A,
			Xterm256.GREEN_3B,
			Xterm256.GREEN_1,
			Xterm256.CHARTREUSE_2A,
			Xterm256.CHARTREUSE_3B,
			Xterm256.CHARTREUSE_3A,
			Xterm256.CHARTREUSE_4,
			Xterm256.ORANGE_4A,
			Xterm256.DARKRED_A,
		],
		[
			Xterm256.NAVYBLUE,
			Xterm256.DEEPSKYBLUE_4A,
			Xterm256.SPRINGGREEN_4,
			Xterm256.SPRINGGREEN_3A,
			Xterm256.SPRINGGREEN_3B,
			Xterm256.SPRINGGREEN_2B,
			Xterm256.SEAGREEN_2,
			Xterm256.PALEGREEN_3A,
			Xterm256.DARKSEAGREEN_4B,
			Xterm256.DARKSEAGREEN_4A,
			Xterm256.GREY_037,
			Xterm256.DEEPPINK_4A,
		],
		[
			Xterm256.DARKBLUE,
			Xterm256.DEEPSKYBLUE_4B,
			Xterm256.TURQUOISE_4,
			Xterm256.DARKCYAN,
			Xterm256.SPRINGGREEN_2A,
			Xterm256.SPRINGGREEN_1,
			Xterm256.SEAGREEN_1A,
			Xterm256.SEAGREEN_3,
			Xterm256.CADETBLUE_A,
			Xterm256.PALETURQUOISE_4,
			Xterm256.MEDIUMPURPLE_4,
			Xterm256.PURPLE_4A,
		],
		[
			Xterm256.BLUE_3A,
			Xterm256.DEEPSKYBLUE_4C,
			Xterm256.DEEPSKYBLUE_3A,
			Xterm256.LIGHTSEAGREEN,
			Xterm256.CYAN_3,
			Xterm256.MEDIUMSPRINGGREEN,
			Xterm256.SEAGREEN_1B,
			Xterm256.AQUAMARINE_3,
			Xterm256.CADETBLUE_B,
			Xterm256.STEELBLUE,
			Xterm256.SLATEBLUE_3_A,
			Xterm256.PURPLE_4B,
		],
		[
			Xterm256.BLUE_3B,
			Xterm256.DODGERBLUE_3,
			Xterm256.DEEPSKYBLUE_3B,
			Xterm256.DEEPSKYBLUE_2,
			Xterm256.DARKTURQUOISE,
			Xterm256.CYAN_2,
			Xterm256.AQUAMARINE_1A,
			Xterm256.MEDIUMTURQUOISE,
			Xterm256.SKYBLUE_3,
			Xterm256.STEELBLUE_3,
			Xterm256.SLATEBLUE_3_B,
			Xterm256.PURPLE_3,
		],
		[
			Xterm256.BLUE_1,
			Xterm256.DODGERBLUE_2,
			Xterm256.DODGERBLUE_1,
			Xterm256.DEEPSKYBLUE_1,
			Xterm256.TURQUOISE_2,
			Xterm256.CYAN_1,
			Xterm256.DARKSLATEGRAY_2,
			Xterm256.STEELBLUE_1B,
			Xterm256.STEELBLUE_1A,
			Xterm256.CORNFLOWERBLUE,
			Xterm256.ROYALBLUE_1,
			Xterm256.BLUEVIOLET,
		],
	]

	static readonly PURPLE_GREEN_PALETTE: Xterm256[][] = [
		[
			Xterm256.PURPLEA,
			Xterm256.SLATEBLUE_1,
			Xterm256.LIGHTSLATEBLUE,
			Xterm256.SKYBLUE_2,
			Xterm256.SKYBLUE_1,
			Xterm256.DARKSLATEGRAY_1,
			Xterm256.PALETURQUOISE_1,
			Xterm256.LIGHTSKYBLUE_1,
			Xterm256.LIGHTSTEELBLUE,
			Xterm256.MEDIUMPURPLE_1,
			Xterm256.MEDIUMPURPLE_2A,
			Xterm256.PURPLEB,
		],
		[
			Xterm256.DARKVIOLETA,
			Xterm256.MEDIUMPURPLE_3B,
			Xterm256.MEDIUMPURPLE,
			Xterm256.LIGHTSKYBLUE_3B,
			Xterm256.DARKSLATEGRAY_3,
			Xterm256.AQUAMARINE_1B,
			Xterm256.DARKSEAGREEN_1A,
			Xterm256.LIGHTCYAN_3,
			Xterm256.LIGHTSTEELBLUE_3,
			Xterm256.MEDIUMPURPLE_2B,
			Xterm256.MEDIUMORCHID,
			Xterm256.DARKVIOLETB,
		],
		[
			Xterm256.DARKMAGENTA_B,
			Xterm256.MEDIUMPURPLE_3A,
			Xterm256.LIGHTSLATEGREY,
			Xterm256.LIGHTSKYBLUE_3A,
			Xterm256.DARKSEAGREEN_3A,
			Xterm256.PALEGREEN_1A,
			Xterm256.DARKSEAGREEN_2B,
			Xterm256.DARKSEAGREEN_2A,
			Xterm256.GREY_069,
			Xterm256.GREY_063,
			Xterm256.MEDIUMORCHID_3,
			Xterm256.MAGENTA_3A,
		],
		[
			Xterm256.DARKMAGENTA_A,
			Xterm256.PLUM_4,
			Xterm256.GREY_053,
			Xterm256.DARKSEAGREEN,
			Xterm256.PALEGREEN_3B,
			Xterm256.LIGHTGREENB,
			Xterm256.PALEGREEN_1B,
			Xterm256.DARKSEAGREEN_3B,
			Xterm256.NAVAJOWHITE_3,
			Xterm256.ROSYBROWN,
			Xterm256.HOTPINK_3A,
			Xterm256.MEDIUMVIOLETRED,
		],
		[
			Xterm256.DEEPPINK_4B,
			Xterm256.LIGHTPINK_4,
			Xterm256.WHEAT_4,
			Xterm256.DARKOLIVEGREEN_3A,
			Xterm256.DARKOLIVEGREEN_3B,
			Xterm256.LIGHTGREENA,
			Xterm256.DARKOLIVEGREEN_2,
			Xterm256.DARKOLIVEGREEN_3C,
			Xterm256.DARKKHAKI,
			Xterm256.LIGHTSALMON_3A,
			Xterm256.INDIANREDA,
			Xterm256.DEEPPINK_4C,
		],
		[
			Xterm256.DARKRED_B,
			Xterm256.ORANGE_4B,
			Xterm256.YELLOW_4A,
			Xterm256.YELLOW_4B,
			Xterm256.CHARTREUSE_2B,
			Xterm256.CHARTREUSE_1,
			Xterm256.GREENYELLOW,
			Xterm256.YELLOW_3A,
			Xterm256.GOLD_3A,
			Xterm256.DARKGOLDENROD,
			Xterm256.DARKORANGE_3A,
			Xterm256.RED_3A,
		],
	]

	static readonly RED_YELLOW_PALETTE: Xterm256[][] = [
		[
			Xterm256.RED_3B,
			Xterm256.DARKORANGE_3B,
			Xterm256.ORANGE_3,
			Xterm256.GOLD_3B,
			Xterm256.YELLOW_3B,
			Xterm256.YELLOW_2,
			Xterm256.YELLOW_1,
			Xterm256.GOLD_1,
			Xterm256.ORANGE_1,
			Xterm256.DARKORANGE,
			Xterm256.ORANGERED_1,
			Xterm256.RED_1,
		],
		[
			Xterm256.DEEPPINK_3A,
			Xterm256.INDIANREDB,
			Xterm256.LIGHTSALMON_3B,
			Xterm256.LIGHTGOLDENROD_3,
			Xterm256.KHAKI_3,
			Xterm256.DARKOLIVEGREEN_1A,
			Xterm256.LIGHTGOLDENROD_1,
			Xterm256.LIGHTGOLDENROD_2B,
			Xterm256.SANDYBROWN,
			Xterm256.SALMON_1,
			Xterm256.INDIANRED_1A,
			Xterm256.DEEPPINK_2,
		],
		[
			Xterm256.DEEPPINK_3B,
			Xterm256.HOTPINK_3B,
			Xterm256.LIGHTPINK_3,
			Xterm256.TAN,
			Xterm256.LIGHTGOLDENROD_2A,
			Xterm256.DARKOLIVEGREEN_1B,
			Xterm256.KHAKI_1,
			Xterm256.LIGHTGOLDENROD_2C,
			Xterm256.LIGHTSALMON_1,
			Xterm256.LIGHTCORAL,
			Xterm256.INDIANRED_1B,
			Xterm256.DEEPPINK_1A,
		],
		[
			Xterm256.MAGENTA_3B,
			Xterm256.HOTPINK_2,
			Xterm256.PINK_3,
			Xterm256.MISTYROSE_3,
			Xterm256.LIGHTYELLOW_3,
			Xterm256.DARKSEAGREEN_1B,
			Xterm256.WHEAT_1,
			Xterm256.NAVAJOWHITE_1,
			Xterm256.LIGHTPINK_1,
			Xterm256.PALEVIOLETRED_1,
			Xterm256.HOTPINKA,
			Xterm256.DEEPPINK_1B,
		],
		[
			Xterm256.MAGENTA_3C,
			Xterm256.ORCHID,
			Xterm256.PLUM_3,
			Xterm256.THISTLE_3,
			Xterm256.GREY_084,
			Xterm256.HONEYDEW_2,
			Xterm256.CORNSILK_1,
			Xterm256.MISTYROSE_1,
			Xterm256.PINK_1,
			Xterm256.ORCHID_2,
			Xterm256.HOTPINKB,
			Xterm256.MAGENTA_2B,
		],
		[
			Xterm256.MAGENTA_2A,
			Xterm256.MEDIUMORCHID_1A,
			Xterm256.VIOLET,
			Xterm256.PLUM_2,
			Xterm256.LIGHTSTEELBLUE_1,
			Xterm256.LIGHTCYAN_1,
			Xterm256.GREY_100,
			Xterm256.THISTLE_1,
			Xterm256.PLUM_1,
			Xterm256.ORCHID_1,
			Xterm256.MEDIUMORCHID_1B,
			Xterm256.MAGENTA_1,
		],
	]

	static readonly GREYS_PALETTE: Xterm256[] = [
		Xterm256.GREY_003,
		Xterm256.GREY_007,
		Xterm256.GREY_011,
		Xterm256.GREY_015,
		Xterm256.GREY_019,
		Xterm256.GREY_023,
		Xterm256.GREY_027,
		Xterm256.GREY_030,
		Xterm256.GREY_035,
		Xterm256.GREY_039,
		Xterm256.GREY_042,
		Xterm256.GREY_046,
		Xterm256.GREY_050,
		Xterm256.GREY_054,
		Xterm256.GREY_058,
		Xterm256.GREY_062,
		Xterm256.GREY_066,
		Xterm256.GREY_070,
		Xterm256.GREY_074,
		Xterm256.GREY_078,
		Xterm256.GREY_082,
		Xterm256.GREY_085,
		Xterm256.GREY_089,
		Xterm256.GREY_093,
	]

	static readonly MONOCHROME_GRADIENT: Xterm256[] = [
		Xterm256.GREY_000,
		Xterm256.GREY_003,
		Xterm256.GREY_007,
		Xterm256.GREY_011,
		Xterm256.GREY_015,
		Xterm256.GREY_019,
		Xterm256.GREY_023,
		Xterm256.GREY_027,
		Xterm256.GREY_030,
		Xterm256.GREY_035,
		Xterm256.GREY_039,
		Xterm256.GREY_042,
		Xterm256.GREY_046,
		Xterm256.GREY_050,
		Xterm256.GREY_054,
		Xterm256.GREY_058,
		Xterm256.GREY_062,
		Xterm256.GREY_066,
		Xterm256.GREY_070,
		Xterm256.GREY_074,
		Xterm256.GREY_078,
		Xterm256.GREY_082,
		Xterm256.GREY_085,
		Xterm256.GREY_089,
		Xterm256.GREY_093,
		Xterm256.GREY_100,
	]

	static readonly DOUBLE_COLOR_GRADIENTS = [
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 0, 12),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 1, 12),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 2, 12),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 3, 12),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 4, 12),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 5, 12),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 0, 12),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 1, 12),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 2, 12),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 3, 12),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 4, 12),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 5, 12),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 0, 12),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 1, 12),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 2, 12),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 3, 12),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 4, 12),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 5, 12),
	]

	static readonly SINGLE_COLOR_GRADIENTS = [
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 0, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 1, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 2, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 3, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 4, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.LEFT, 5, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.RIGHT, 0, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.RIGHT, 1, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.RIGHT, 2, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.RIGHT, 3, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.RIGHT, 4, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.RIGHT, 5, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 0, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 1, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 2, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 3, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 4, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 5, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 6, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 7, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 8, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 9, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 10, 6),
		new MatrixGradient(this.BLUE_GREEN_PALETTE, MatrixStart.TOP, 11, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 0, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 1, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 2, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 3, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 4, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.LEFT, 5, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.RIGHT, 0, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.RIGHT, 1, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.RIGHT, 2, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.RIGHT, 3, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.RIGHT, 4, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.RIGHT, 5, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 0, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 1, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 2, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 3, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 4, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 5, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 6, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 7, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 8, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 9, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 10, 6),
		new MatrixGradient(this.PURPLE_GREEN_PALETTE, MatrixStart.TOP, 11, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 0, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 1, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 2, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 3, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 4, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.LEFT, 5, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.RIGHT, 0, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.RIGHT, 1, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.RIGHT, 2, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.RIGHT, 3, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.RIGHT, 4, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.RIGHT, 5, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 0, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 1, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 2, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 3, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 4, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 5, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 6, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 7, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 8, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 9, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 10, 6),
		new MatrixGradient(this.RED_YELLOW_PALETTE, MatrixStart.TOP, 11, 6),
	]

	private static findGradient(palette: MatrixGradient[], start: Xterm256, end: Xterm256): Xterm256[] | undefined {
		const gradients: Xterm256[][] = palette.map((g) => g.get())
		const matching: Xterm256[][] = gradients.filter(
			(a) => (a[0] == start && a[a.length - 1] == end) || (a[0] == end && a[a.length - 1] == start)
		)
		return matching.length > 0 ? matching[0] : undefined
	}

	/**
	 * Returns the single color gradient with the given start and end colors
	 * @param start the start color
	 * @param end the end color
	 */
	static singleColorGradient(start: Xterm256, end: Xterm256): Xterm256[] | undefined {
		return this.findGradient(this.SINGLE_COLOR_GRADIENTS, start, end)
	}

	static singleColorGradientOrExit(start: Xterm256, end: Xterm256): Xterm256[] {
		const result = this.findGradient(this.SINGLE_COLOR_GRADIENTS, start, end)
		return result === undefined ? process.exit(1) : result
	}

	/**
	 * Returns the double color gradient with the given start and end colors
	 * @param start the start color
	 * @param end the end color
	 */
	static doubleColorGradient(start: Xterm256, end: Xterm256): Xterm256[] | undefined {
		return this.findGradient(this.DOUBLE_COLOR_GRADIENTS, start, end)
	}

	static doubleColorGradientOrExit(start: Xterm256, end: Xterm256): Xterm256[] {
		const result = this.findGradient(this.DOUBLE_COLOR_GRADIENTS, start, end)
		return result === undefined ? process.exit(1) : result
	}
}

export { MatrixGradient, XtermColorGradients }
