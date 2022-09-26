import { Xterm256 } from './colors'

/**
 * Color gradients for XTerm 256 terminals.
 * Run `tools colorblocks` to see them all.
 */
class XtermGradients {
	static readonly SINGLE_COLOR_GRADIENTS = {
		DARKRED_A_TO_CHARTREUSE_2A: [52, 58, 64, 70, 76, 82],
		DEEPPINK_4A_TO_SEAGREEN_2: [53, 59, 65, 71, 77, 83],
		PURPLE_4A_TO_SEAGREEN_1A: [54, 60, 66, 72, 78, 84],
		PURPLE_4B_TO_SEAGREEN_1B: [55, 61, 67, 73, 79, 85],
		PURPLE_3_TO_AQUAMARINE_1A: [56, 62, 68, 74, 80, 86],
		BLUEVIOLET_TO_DARKSLATEGRAY_2: [57, 63, 69, 75, 81, 87],
		GREY_000_TO_GREEN_1: [16, 22, 28, 34, 40, 46],
		NAVYBLUE_TO_SPRINGGREEN_2B: [17, 23, 29, 35, 41, 47],
		DARKBLUE_TO_SPRINGGREEN_1: [18, 24, 30, 36, 42, 48],
		BLUE_3A_TO_MEDIUMSPRINGGREEN: [19, 25, 31, 37, 43, 49],
		BLUE_3B_TO_CYAN_2: [20, 26, 32, 38, 44, 50],
		BLUE_1_TO_CYAN_1: [21, 27, 33, 39, 45, 51],
		GREY_000_TO_BLUE_1: [16, 17, 18, 19, 20, 21],
		DARKGREEN_TO_DODGERBLUE_2: [22, 23, 24, 25, 26, 27],
		GREEN_4_TO_DODGERBLUE_1: [28, 29, 30, 31, 32, 33],
		GREEN_3A_TO_DEEPSKYBLUE_1: [34, 35, 36, 37, 38, 39],
		GREEN_3B_TO_TURQUOISE_2: [40, 41, 42, 43, 44, 45],
		GREEN_1_TO_CYAN_1: [46, 47, 48, 49, 50, 51],
		CHARTREUSE_2A_TO_DARKSLATEGRAY_2: [82, 83, 84, 85, 86, 87],
		CHARTREUSE_3B_TO_STEELBLUE_1B: [76, 77, 78, 79, 80, 81],
		CHARTREUSE_3A_TO_STEELBLUE_1A: [70, 71, 72, 73, 74, 75],
		CHARTREUSE_4_TO_CORNFLOWERBLUE: [64, 65, 66, 67, 68, 69],
		ORANGE_4A_TO_ROYALBLUE_1: [58, 59, 60, 61, 62, 63],
		DARKRED_A_TO_BLUEVIOLET: [52, 53, 54, 55, 56, 57],
		PURPLEB_TO_PALETURQUOISE_1: [129, 135, 141, 147, 153, 159],
		DARKVIOLETB_TO_DARKSEAGREEN_1A: [128, 134, 140, 146, 152, 158],
		MAGENTA_3A_TO_DARKSEAGREEN_2B: [127, 133, 139, 145, 151, 157],
		MEDIUMVIOLETRED_TO_PALEGREEN_1B: [126, 132, 138, 144, 150, 156],
		DEEPPINK_4C_TO_DARKOLIVEGREEN_2: [125, 131, 137, 143, 149, 155],
		RED_3A_TO_GREENYELLOW: [124, 130, 136, 142, 148, 154],
		PURPLEA_TO_DARKSLATEGRAY_1: [93, 99, 105, 111, 117, 123],
		DARKVIOLETA_TO_AQUAMARINE_1B: [92, 98, 104, 110, 116, 122],
		DARKMAGENTA_B_TO_PALEGREEN_1A: [91, 97, 103, 109, 115, 121],
		DARKMAGENTA_A_TO_LIGHTGREENB: [90, 96, 102, 108, 114, 120],
		DEEPPINK_4B_TO_LIGHTGREENA: [89, 95, 101, 107, 113, 119],
		DARKRED_B_TO_CHARTREUSE_1: [88, 94, 100, 106, 112, 118],
		PURPLEA_TO_DARKRED_B: [93, 92, 91, 90, 89, 88],
		SLATEBLUE_1_TO_ORANGE_4B: [99, 98, 97, 96, 95, 94],
		LIGHTSLATEBLUE_TO_YELLOW_4A: [105, 104, 103, 102, 101, 100],
		SKYBLUE_2_TO_YELLOW_4B: [111, 110, 109, 108, 107, 106],
		SKYBLUE_1_TO_CHARTREUSE_2B: [117, 116, 115, 114, 113, 112],
		DARKSLATEGRAY_1_TO_CHARTREUSE_1: [123, 122, 121, 120, 119, 118],
		PALETURQUOISE_1_TO_GREENYELLOW: [159, 158, 157, 156, 155, 154],
		LIGHTSKYBLUE_1_TO_YELLOW_3A: [153, 152, 151, 150, 149, 148],
		LIGHTSTEELBLUE_TO_GOLD_3A: [147, 146, 145, 144, 143, 142],
		MEDIUMPURPLE_1_TO_DARKGOLDENROD: [141, 140, 139, 138, 137, 136],
		MEDIUMPURPLE_2A_TO_DARKORANGE_3A: [135, 134, 133, 132, 131, 130],
		PURPLEB_TO_RED_3A: [129, 128, 127, 126, 125, 124],
		RED_1_TO_YELLOW_1: [196, 202, 208, 214, 220, 226],
		DEEPPINK_2_TO_LIGHTGOLDENROD_1: [197, 203, 209, 215, 221, 227],
		DEEPPINK_1A_TO_KHAKI_1: [198, 204, 210, 216, 222, 228],
		DEEPPINK_1B_TO_WHEAT_1: [199, 205, 211, 217, 223, 229],
		MAGENTA_2B_TO_CORNSILK_1: [200, 206, 212, 218, 224, 230],
		MAGENTA_1_TO_GREY_100: [201, 207, 213, 219, 225, 231],
		RED_3B_TO_YELLOW_2: [160, 166, 172, 178, 184, 190],
		DEEPPINK_3A_TO_DARKOLIVEGREEN_1A: [161, 167, 173, 179, 185, 191],
		DEEPPINK_3B_TO_DARKOLIVEGREEN_1B: [162, 168, 174, 180, 186, 192],
		MAGENTA_3B_TO_DARKSEAGREEN_1B: [163, 169, 175, 181, 187, 193],
		MAGENTA_3C_TO_HONEYDEW_2: [164, 170, 176, 182, 188, 194],
		MAGENTA_2A_TO_LIGHTCYAN_1: [165, 171, 177, 183, 189, 195],
		RED_3B_TO_MAGENTA_2A: [160, 161, 162, 163, 164, 165],
		DARKORANGE_3B_TO_MEDIUMORCHID_1A: [166, 167, 168, 169, 170, 171],
		ORANGE_3_TO_VIOLET: [172, 173, 174, 175, 176, 177],
		GOLD_3B_TO_PLUM_2: [178, 179, 180, 181, 182, 183],
		YELLOW_3B_TO_LIGHTSTEELBLUE_1: [184, 185, 186, 187, 188, 189],
		YELLOW_2_TO_LIGHTCYAN_1: [190, 191, 192, 193, 194, 195],
		YELLOW_1_TO_GREY_100: [226, 227, 228, 229, 230, 231],
		GOLD_1_TO_THISTLE_1: [220, 221, 222, 223, 224, 225],
		ORANGE_1_TO_PLUM_1: [214, 215, 216, 217, 218, 219],
		DARKORANGE_TO_ORCHID_1: [208, 209, 210, 211, 212, 213],
		ORANGERED_1_TO_MEDIUMORCHID_1B: [202, 203, 204, 205, 206, 207],
		RED_1_TO_MAGENTA_1: [196, 197, 198, 199, 200, 201],
	}

	static readonly DOUBLE_COLOR_GRADIENTS = {
		DARKRED_A_TO_GREY_000: [52, 58, 64, 70, 76, 82, 46, 40, 34, 28, 22, 16],
		DEEPPINK_4A_TO_NAVYBLUE: [53, 59, 65, 71, 77, 83, 47, 41, 35, 29, 23, 17],
		PURPLE_4A_TO_DARKBLUE: [54, 60, 66, 72, 78, 84, 48, 42, 36, 30, 24, 18],
		PURPLE_4B_TO_BLUE_3A: [55, 61, 67, 73, 79, 85, 49, 43, 37, 31, 25, 19],
		PURPLE_3_TO_BLUE_3B: [56, 62, 68, 74, 80, 86, 50, 44, 38, 32, 26, 20],
		BLUEVIOLET_TO_BLUE_1: [57, 63, 69, 75, 81, 87, 51, 45, 39, 33, 27, 21],
		PURPLEB_TO_PURPLEA: [129, 135, 141, 147, 153, 159, 123, 117, 111, 105, 99, 93],
		DARKVIOLETB_TO_DARKVIOLETA: [128, 134, 140, 146, 152, 158, 122, 116, 110, 104, 98, 92],
		MAGENTA_3A_TO_DARKMAGENTA_B: [127, 133, 139, 145, 151, 157, 121, 115, 109, 103, 97, 91],
		MEDIUMVIOLETRED_TO_DARKMAGENTA_A: [126, 132, 138, 144, 150, 156, 120, 114, 108, 102, 96, 90],
		DEEPPINK_4C_TO_DEEPPINK_4B: [125, 131, 137, 143, 149, 155, 119, 113, 107, 101, 95, 89],
		RED_3A_TO_DARKRED_B: [124, 130, 136, 142, 148, 154, 118, 112, 106, 100, 94, 88],
		RED_1_TO_RED_3B: [196, 202, 208, 214, 220, 226, 190, 184, 178, 172, 166, 160],
		DEEPPINK_2_TO_DEEPPINK_3A: [197, 203, 209, 215, 221, 227, 191, 185, 179, 173, 167, 161],
		DEEPPINK_1A_TO_DEEPPINK_3B: [198, 204, 210, 216, 222, 228, 192, 186, 180, 174, 168, 162],
		DEEPPINK_1B_TO_MAGENTA_3B: [199, 205, 211, 217, 223, 229, 193, 187, 181, 175, 169, 163],
		MAGENTA_2B_TO_MAGENTA_3C: [200, 206, 212, 218, 224, 230, 194, 188, 182, 176, 170, 164],
		MAGENTA_1_TO_MAGENTA_2A: [201, 207, 213, 219, 225, 231, 195, 189, 183, 177, 171, 165],
	}

	static readonly MONOCHROME_GRADIENT: Xterm256[] = [
		16, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252,
		253, 254, 255, 231,
	]
}

export { XtermGradients }
