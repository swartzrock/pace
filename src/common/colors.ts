import {StringUtils} from './stringutils'
import {isNaN, parseInt} from 'lodash'

class Colors {
	static readonly ANSI_RESET_COLOR = '\u001b[0m'

	static foregroundColor(s: string, fg: Xterm256): string {
		if (!(fg in Xterm256)) return s
		const colorIndex = fg.valueOf()
		return `${Colors.createForegroundColorCode(colorIndex)}${s}${Colors.ANSI_RESET_COLOR}`
	}

	static backgroundColor(s: string, bg: Xterm256): string {
		if (!(bg in Xterm256)) return s
		const colorIndex = bg.valueOf()
		return `${Colors.createBackgroundColorCode(colorIndex)}${s}${Colors.ANSI_RESET_COLOR}`
	}

	static foregroundAndBackgroundColor(s: string, fg: Xterm256, bg: Xterm256): string {
		if (!(fg in Xterm256) || !(bg in Xterm256)) return s
		const fgIndex = fg.valueOf()
		const bgIndex = bg.valueOf()
		return `${Colors.createForegroundColorCode(fgIndex)}${Colors.createBackgroundColorCode(bgIndex)}${s}${
			Colors.ANSI_RESET_COLOR
		}`
	}

	// Evenly apply a vertical gradient to a text block
	static setVerticalGradient(s: string, colors: Xterm256[]): string {
		const lines = StringUtils.toLines(s)
		const coloredLines = lines.map((line: string, index: number) => {
			return Colors.foregroundColor(line, colors[Math.floor((index / lines.length) * colors.length)])
		})
		return StringUtils.toTextBlock(coloredLines)
	}

	private static colorCodes: string[]
	private static colorNames: string[]

	private static initColorCodeNames() {
		if (!Colors.colorCodes || !Colors.colorNames) {
			Colors.colorCodes = <string[]>Object.keys(Xterm256)
			Colors.colorNames = <string[]>Object.values(Xterm256)
		}
	}

	static colorName(color: Xterm256): string {
		Colors.initColorCodeNames()
		const colorIndex = Colors.colorCodes.indexOf(color.toString())
		return this.colorNames[colorIndex]
	}

	static contrastColor(color: Xterm256): Xterm256 {
		const xtermValue = color.valueOf()
		if (xtermValue < 16) {
			return xtermValue == 0 ? Xterm256.WHITE : Xterm256.BLACK
		}
		if (xtermValue > 231) {
			return xtermValue < 244 ? Xterm256.WHITE : Xterm256.BLACK
		}

		const g = ((xtermValue - 16) % 36) / 6
		return g > 1.9 ? Xterm256.BLACK : Xterm256.WHITE
	}

	static detectFgColor(s: string): number | null {
		// eslint-disable-next-line no-control-regex
		const fgColorIndex = parseInt(s.replace(/[\u001b]\[38;5;(\d+)m.*/, '$1'))
		return isNaN(fgColorIndex) ? null : fgColorIndex
	}

	private static createForegroundColorCode = (colorIndex: number): string => `\u001b[38;5;${colorIndex}m`
	private static createBackgroundColorCode = (colorIndex: number): string => `\u001b[48;5;${colorIndex}m`
}

enum Xterm256 {
	BLACK = 0,
	MAROON = 1,
	GREEN = 2,
	OLIVE = 3,
	NAVY = 4,
	TEAL = 6,
	SILVER = 7,
	GREY = 8,
	RED = 9,
	LIME = 10,
	YELLOW = 11,
	BLUE = 12,
	FUCHSIA = 13,
	AQUA = 14,
	WHITE = 15,
	GREY_000 = 16,
	NAVYBLUE = 17,
	DARKBLUE = 18,
	BLUE_3A = 19,
	BLUE_3B = 20,
	BLUE_1 = 21,
	DARKGREEN = 22,
	DEEPSKYBLUE_4A = 23,
	DEEPSKYBLUE_4B = 24,
	DEEPSKYBLUE_4C = 25,
	DODGERBLUE_3 = 26,
	DODGERBLUE_2 = 27,
	GREEN_4 = 28,
	SPRINGGREEN_4 = 29,
	TURQUOISE_4 = 30,
	DEEPSKYBLUE_3A = 31,
	DEEPSKYBLUE_3B = 32,
	DODGERBLUE_1 = 33,
	GREEN_3A = 34,
	SPRINGGREEN_3A = 35,
	DARKCYAN = 36,
	LIGHTSEAGREEN = 37,
	DEEPSKYBLUE_2 = 38,
	DEEPSKYBLUE_1 = 39,
	GREEN_3B = 40,
	SPRINGGREEN_3B = 41,
	SPRINGGREEN_2A = 42,
	CYAN_3 = 43,
	DARKTURQUOISE = 44,
	TURQUOISE_2 = 45,
	GREEN_1 = 46,
	SPRINGGREEN_2B = 47,
	SPRINGGREEN_1 = 48,
	MEDIUMSPRINGGREEN = 49,
	CYAN_2 = 50,
	CYAN_1 = 51,
	DARKRED_A = 52,
	DEEPPINK_4A = 53,
	PURPLE_4A = 54,
	PURPLE_4B = 55,
	PURPLE_3 = 56,
	BLUEVIOLET = 57,
	ORANGE_4A = 58,
	GREY_037 = 59,
	MEDIUMPURPLE_4 = 60,
	SLATEBLUE_3_A = 61,
	SLATEBLUE_3_B = 62,
	ROYALBLUE_1 = 63,
	CHARTREUSE_4 = 64,
	DARKSEAGREEN_4A = 65,
	PALETURQUOISE_4 = 66,
	STEELBLUE = 67,
	STEELBLUE_3 = 68,
	CORNFLOWERBLUE = 69,
	CHARTREUSE_3A = 70,
	DARKSEAGREEN_4B = 71,
	CADETBLUE_A = 72,
	CADETBLUE_B = 73,
	SKYBLUE_3 = 74,
	STEELBLUE_1A = 75,
	CHARTREUSE_3B = 76,
	PALEGREEN_3A = 77,
	SEAGREEN_3 = 78,
	AQUAMARINE_3 = 79,
	MEDIUMTURQUOISE = 80,
	STEELBLUE_1B = 81,
	CHARTREUSE_2A = 82,
	SEAGREEN_2 = 83,
	SEAGREEN_1A = 84,
	SEAGREEN_1B = 85,
	AQUAMARINE_1A = 86,
	DARKSLATEGRAY_2 = 87,
	DARKRED_B = 88,
	DEEPPINK_4B = 89,
	DARKMAGENTA_A = 90,
	DARKMAGENTA_B = 91,
	DARKVIOLETA = 92,
	PURPLEA = 93,
	ORANGE_4B = 94,
	LIGHTPINK_4 = 95,
	PLUM_4 = 96,
	MEDIUMPURPLE_3A = 97,
	MEDIUMPURPLE_3B = 98,
	SLATEBLUE_1 = 99,
	YELLOW_4A = 100,
	WHEAT_4 = 101,
	GREY_053 = 102,
	LIGHTSLATEGREY = 103,
	MEDIUMPURPLE = 104,
	LIGHTSLATEBLUE = 105,
	YELLOW_4B = 106,
	DARKOLIVEGREEN_3A = 107,
	DARKSEAGREEN = 108,
	LIGHTSKYBLUE_3A = 109,
	LIGHTSKYBLUE_3B = 110,
	SKYBLUE_2 = 111,
	CHARTREUSE_2B = 112,
	DARKOLIVEGREEN_3B = 113,
	PALEGREEN_3B = 114,
	DARKSEAGREEN_3A = 115,
	DARKSLATEGRAY_3 = 116,
	SKYBLUE_1 = 117,
	CHARTREUSE_1 = 118,
	LIGHTGREENA = 119,
	LIGHTGREENB = 120,
	PALEGREEN_1A = 121,
	AQUAMARINE_1B = 122,
	DARKSLATEGRAY_1 = 123,
	RED_3A = 124,
	DEEPPINK_4C = 125,
	MEDIUMVIOLETRED = 126,
	MAGENTA_3A = 127,
	DARKVIOLETB = 128,
	PURPLEB = 129,
	DARKORANGE_3A = 130,
	INDIANREDA = 131,
	HOTPINK_3A = 132,
	MEDIUMORCHID_3 = 133,
	MEDIUMORCHID = 134,
	MEDIUMPURPLE_2A = 135,
	DARKGOLDENROD = 136,
	LIGHTSALMON_3A = 137,
	ROSYBROWN = 138,
	GREY_063 = 139,
	MEDIUMPURPLE_2B = 140,
	MEDIUMPURPLE_1 = 141,
	GOLD_3A = 142,
	DARKKHAKI = 143,
	NAVAJOWHITE_3 = 144,
	GREY_069 = 145,
	LIGHTSTEELBLUE_3 = 146,
	LIGHTSTEELBLUE = 147,
	YELLOW_3A = 148,
	DARKOLIVEGREEN_3C = 149,
	DARKSEAGREEN_3B = 150,
	DARKSEAGREEN_2A = 151,
	LIGHTCYAN_3 = 152,
	LIGHTSKYBLUE_1 = 153,
	GREENYELLOW = 154,
	DARKOLIVEGREEN_2 = 155,
	PALEGREEN_1B = 156,
	DARKSEAGREEN_2B = 157,
	DARKSEAGREEN_1A = 158,
	PALETURQUOISE_1 = 159,
	RED_3B = 160,
	DEEPPINK_3A = 161,
	DEEPPINK_3B = 162,
	MAGENTA_3B = 163,
	MAGENTA_3C = 164,
	MAGENTA_2A = 165,
	DARKORANGE_3B = 166,
	INDIANREDB = 167,
	HOTPINK_3B = 168,
	HOTPINK_2 = 169,
	ORCHID = 170,
	MEDIUMORCHID_1A = 171,
	ORANGE_3 = 172,
	LIGHTSALMON_3B = 173,
	LIGHTPINK_3 = 174,
	PINK_3 = 175,
	PLUM_3 = 176,
	VIOLET = 177,
	GOLD_3B = 178,
	LIGHTGOLDENROD_3 = 179,
	TAN = 180,
	MISTYROSE_3 = 181,
	THISTLE_3 = 182,
	PLUM_2 = 183,
	YELLOW_3B = 184,
	KHAKI_3 = 185,
	LIGHTGOLDENROD_2A = 186,
	LIGHTYELLOW_3 = 187,
	GREY_084 = 188,
	LIGHTSTEELBLUE_1 = 189,
	YELLOW_2 = 190,
	DARKOLIVEGREEN_1A = 191,
	DARKOLIVEGREEN_1B = 192,
	DARKSEAGREEN_1B = 193,
	HONEYDEW_2 = 194,
	LIGHTCYAN_1 = 195,
	RED_1 = 196,
	DEEPPINK_2 = 197,
	DEEPPINK_1A = 198,
	DEEPPINK_1B = 199,
	MAGENTA_2B = 200,
	MAGENTA_1 = 201,
	ORANGERED_1 = 202,
	INDIANRED_1A = 203,
	INDIANRED_1B = 204,
	HOTPINKA = 205,
	HOTPINKB = 206,
	MEDIUMORCHID_1B = 207,
	DARKORANGE = 208,
	SALMON_1 = 209,
	LIGHTCORAL = 210,
	PALEVIOLETRED_1 = 211,
	ORCHID_2 = 212,
	ORCHID_1 = 213,
	ORANGE_1 = 214,
	SANDYBROWN = 215,
	LIGHTSALMON_1 = 216,
	LIGHTPINK_1 = 217,
	PINK_1 = 218,
	PLUM_1 = 219,
	GOLD_1 = 220,
	LIGHTGOLDENROD_2B = 221,
	LIGHTGOLDENROD_2C = 222,
	NAVAJOWHITE_1 = 223,
	MISTYROSE_1 = 224,
	THISTLE_1 = 225,
	YELLOW_1 = 226,
	LIGHTGOLDENROD_1 = 227,
	KHAKI_1 = 228,
	WHEAT_1 = 229,
	CORNSILK_1 = 230,
	GREY_100 = 231,
	GREY_003 = 232,
	GREY_007 = 233,
	GREY_011 = 234,
	GREY_015 = 235,
	GREY_019 = 236,
	GREY_023 = 237,
	GREY_027 = 238,
	GREY_030 = 239,
	GREY_035 = 240,
	GREY_039 = 241,
	GREY_042 = 242,
	GREY_046 = 243,
	GREY_050 = 244,
	GREY_054 = 245,
	GREY_058 = 246,
	GREY_062 = 247,
	GREY_066 = 248,
	GREY_070 = 249,
	GREY_074 = 250,
	GREY_078 = 251,
	GREY_082 = 252,
	GREY_085 = 253,
	GREY_089 = 254,
	GREY_093 = 255,
}

export { Colors, Xterm256 }
