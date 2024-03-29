import figlet from 'figlet'

class Fonts {
	static render(font: FigletFonts, text: string) {
		const fontType: figlet.Fonts = <figlet.Fonts>font.valueOf()

		return figlet.textSync(text, {
			font: fontType,
			horizontalLayout: 'default',
			verticalLayout: 'default',
		})
	}
}

enum FigletFonts {
	ONE_ROW = '1Row',
	THREE_D = '3-D',
	THREED_DIAGONAL = '3D Diagonal',
	THREED_ASCII = '3D-ASCII',
	THREEX5 = '3x5',
	FOURMAX = '4Max',
	FIVE_LINE_OBLIQUE = '5 Line Oblique',
	AMC_3_LINE = 'AMC 3 Line',
	AMC_3_LIV1 = 'AMC 3 Liv1',
	AMC_AAA01 = 'AMC AAA01',
	AMC_NEKO = 'AMC Neko',
	AMC_RAZOR = 'AMC Razor',
	AMC_RAZOR2 = 'AMC Razor2',
	AMC_SLASH = 'AMC Slash',
	AMC_SLIDER = 'AMC Slider',
	AMC_THIN = 'AMC Thin',
	AMC_TUBES = 'AMC Tubes',
	AMC_UNTITLED = 'AMC Untitled',
	ANSI_REGULAR = 'ANSI Regular',
	ANSI_SHADOW = 'ANSI Shadow',
	ASCII_NEW_ROMAN = 'ASCII New Roman',
	ACROBATIC = 'Acrobatic',
	ALLIGATOR = 'Alligator',
	ALLIGATOR2 = 'Alligator2',
	ALPHA = 'Alpha',
	ALPHABET = 'Alphabet',
	ARROWS = 'Arrows',
	AVATAR = 'Avatar',
	B1FF = 'B1FF',
	BANNER = 'Banner',
	BANNER3_D = 'Banner3-D',
	BANNER3 = 'Banner3',
	BANNER4 = 'Banner4',
	BARBWIRE = 'Barbwire',
	BASIC = 'Basic',
	BEAR = 'Bear',
	BELL = 'Bell',
	BENJAMIN = 'Benjamin',
	BIG_CHIEF = 'Big Chief',
	BIG_MONEY_NE = 'Big Money-ne',
	BIG_MONEY_NW = 'Big Money-nw',
	BIG_MONEY_SE = 'Big Money-se',
	BIG_MONEY_SW = 'Big Money-sw',
	BIG = 'Big',
	BIGFIG = 'Bigfig',
	BINARY = 'Binary',
	BLOCK = 'Block',
	BLOCKS = 'Blocks',
	BLOODY = 'Bloody',
	BOLGER = 'Bolger',
	BRACED = 'Braced',
	BRIGHT = 'Bright',
	BROADWAY_KB = 'Broadway KB',
	BROADWAY = 'Broadway',
	BUBBLE = 'Bubble',
	BULBHEAD = 'Bulbhead',
	CALIGRAPHY = 'Caligraphy',
	CALIGRAPHY2 = 'Caligraphy2',
	CALVIN_S = 'Calvin S',
	CARDS = 'Cards',
	CATWALK = 'Catwalk',
	CHISELED = 'Chiseled',
	CHUNKY = 'Chunky',
	COINSTAK = 'Coinstak',
	COLA = 'Cola',
	COLOSSAL = 'Colossal',
	COMPUTER = 'Computer',
	CONTESSA = 'Contessa',
	CONTRAST = 'Contrast',
	COSMIKE = 'Cosmike',
	CRAWFORD = 'Crawford',
	CRAWFORD2 = 'Crawford2',
	CRAZY = 'Crazy',
	CRICKET = 'Cricket',
	CURSIVE = 'Cursive',
	CYBERLARGE = 'Cyberlarge',
	CYBERMEDIUM = 'Cybermedium',
	CYBERSMALL = 'Cybersmall',
	CYGNET = 'Cygnet',
	DANC4 = 'DANC4',
	DOS_REBEL = 'DOS Rebel',
	DWHISTLED = 'DWhistled',
	DANCING_FONT = 'Dancing Font',
	DECIMAL = 'Decimal',
	DEF_LEPPARD = 'Def Leppard',
	DELTA_CORPS_PRIEST_1 = 'Delta Corps Priest 1',
	DIAMOND = 'Diamond',
	DIET_COLA = 'Diet Cola',
	DIGITAL = 'Digital',
	DOH = 'Doh',
	DOOM = 'Doom',
	DOT_MATRIX = 'Dot Matrix',
	DOUBLE_SHORTS = 'Double Shorts',
	DOUBLE = 'Double',
	DR_PEPPER = 'Dr Pepper',
	EFTI_CHESS = 'Efti Chess',
	EFTI_FONT = 'Efti Font',
	EFTI_ITALIC = 'Efti Italic',
	EFTI_PITI = 'Efti Piti',
	EFTI_ROBOT = 'Efti Robot',
	EFTI_WALL = 'Efti Wall',
	EFTI_WATER = 'Efti Water',
	ELECTRONIC = 'Electronic',
	ELITE = 'Elite',
	EPIC = 'Epic',
	FENDER = 'Fender',
	FILTER = 'Filter',
	FIRE_FONT_K = 'Fire Font-k',
	FIRE_FONT_S = 'Fire Font-s',
	FLIPPED = 'Flipped',
	FLOWER_POWER = 'Flower Power',
	FOUR_TOPS = 'Four Tops',
	FRAKTUR = 'Fraktur',
	FUN_FACE = 'Fun Face',
	FUN_FACES = 'Fun Faces',
	FUZZY = 'Fuzzy',
	GEORGI16 = 'Georgi16',
	GEORGIA11 = 'Georgia11',
	GHOST = 'Ghost',
	GHOULISH = 'Ghoulish',
	GLENYN = 'Glenyn',
	GOOFY = 'Goofy',
	GOTHIC = 'Gothic',
	GRACEFUL = 'Graceful',
	GRADIENT = 'Gradient',
	GRAFFITI = 'Graffiti',
	GREEK = 'Greek',
	HEART_LEFT = 'Heart Left',
	HEART_RIGHT = 'Heart Right',
	HENRY_3D = 'Henry 3D',
	HEX = 'Hex',
	HIEROGLYPHS = 'Hieroglyphs',
	HOLLYWOOD = 'Hollywood',
	HORIZONTAL_LEFT = 'Horizontal Left',
	HORIZONTAL_RIGHT = 'Horizontal Right',
	ICL_1900 = 'ICL-1900',
	IMPOSSIBLE = 'Impossible',
	INVITA = 'Invita',
	ISOMETRIC1 = 'Isometric1',
	ISOMETRIC2 = 'Isometric2',
	ISOMETRIC3 = 'Isometric3',
	ISOMETRIC4 = 'Isometric4',
	ITALIC = 'Italic',
	IVRIT = 'Ivrit',
	JS_BLOCK_LETTERS = 'JS Block Letters',
	JS_BRACKET_LETTERS = 'JS Bracket Letters',
	JS_CAPITAL_CURVES = 'JS Capital Curves',
	JS_CURSIVE = 'JS Cursive',
	JS_STICK_LETTERS = 'JS Stick Letters',
	JACKY = 'Jacky',
	JAZMINE = 'Jazmine',
	JERUSALEM = 'Jerusalem',
	KATAKANA = 'Katakana',
	KBAN = 'Kban',
	KEYBOARD = 'Keyboard',
	KNOB = 'Knob',
	KONTO_SLANT = 'Konto Slant',
	KONTO = 'Konto',
	LCD = 'LCD',
	LARRY_3D_2 = 'Larry 3D 2',
	LARRY_3D = 'Larry 3D',
	LEAN = 'Lean',
	LETTERS = 'Letters',
	LIL_DEVIL = 'Lil Devil',
	LINE_BLOCKS = 'Line Blocks',
	LINUX = 'Linux',
	LOCKERGNOME = 'Lockergnome',
	MADRID = 'Madrid',
	MARQUEE = 'Marquee',
	MAXFOUR = 'Maxfour',
	MERLIN1 = 'Merlin1',
	MERLIN2 = 'Merlin2',
	MIKE = 'Mike',
	MINI = 'Mini',
	MIRROR = 'Mirror',
	MNEMONIC = 'Mnemonic',
	MODULAR = 'Modular',
	MORSE = 'Morse',
	MORSE2 = 'Morse2',
	MOSCOW = 'Moscow',
	MSHEBREW210 = 'Mshebrew210',
	MUZZLE = 'Muzzle',
	NSCRIPT = 'NScript',
	NT_GREEK = 'NT Greek',
	NV_SCRIPT = 'NV Script',
	NANCYJ_FANCY = 'Nancyj-Fancy',
	NANCYJ_IMPROVED = 'Nancyj-Improved',
	NANCYJ_UNDERLINED = 'Nancyj-Underlined',
	NANCYJ = 'Nancyj',
	NIPPLES = 'Nipples',
	O8 = 'O8',
	OS2 = 'OS2',
	OCTAL = 'Octal',
	OGRE = 'Ogre',
	OLD_BANNER = 'Old Banner',
	PAGGA = 'Pagga',
	PATORJKS_CHEESE = "Patorjk's Cheese",
	PATORJK_HEX = 'Patorjk-HeX',
	PAWP = 'Pawp',
	PEAKS_SLANT = 'Peaks Slant',
	PEAKS = 'Peaks',
	PEBBLES = 'Pebbles',
	PEPPER = 'Pepper',
	POISON = 'Poison',
	PUFFY = 'Puffy',
	PUZZLE = 'Puzzle',
	PYRAMID = 'Pyramid',
	RAMMSTEIN = 'Rammstein',
	RECTANGLES = 'Rectangles',
	RED_PHOENIX = 'Red Phoenix',
	RELIEF = 'Relief',
	RELIEF2 = 'Relief2',
	REVERSE = 'Reverse',
	ROMAN = 'Roman',
	ROT13 = 'Rot13',
	ROTATED = 'Rotated',
	ROUNDED = 'Rounded',
	ROWAN_CAP = 'Rowan Cap',
	ROZZO = 'Rozzo',
	RUNIC = 'Runic',
	RUNYC = 'Runyc',
	S_BLOOD = 'S Blood',
	SL_SCRIPT = 'SL Script',
	SANTA_CLARA = 'Santa Clara',
	SCRIPT = 'Script',
	SERIFCAP = 'Serifcap',
	SHADOW = 'Shadow',
	SHIMROD = 'Shimrod',
	SHORT = 'Short',
	SLANT_RELIEF = 'Slant Relief',
	SLANT = 'Slant',
	SLIDE = 'Slide',
	SMALL_CAPS = 'Small Caps',
	SMALL_ISOMETRIC1 = 'Small Isometric1',
	SMALL_KEYBOARD = 'Small Keyboard',
	SMALL_POISON = 'Small Poison',
	SMALL_SCRIPT = 'Small Script',
	SMALL_SHADOW = 'Small Shadow',
	SMALL_SLANT = 'Small Slant',
	SMALL_TENGWAR = 'Small Tengwar',
	SMALL = 'Small',
	SOFT = 'Soft',
	SPEED = 'Speed',
	SPLIFF = 'Spliff',
	STACEY = 'Stacey',
	STAMPATE = 'Stampate',
	STAMPATELLO = 'Stampatello',
	STANDARD = 'Standard',
	STAR_STRIPS = 'Star Strips',
	STAR_WARS = 'Star Wars',
	STELLAR = 'Stellar',
	STFOREK = 'Stforek',
	STICK_LETTERS = 'Stick Letters',
	STOP = 'Stop',
	STRAIGHT = 'Straight',
	STRONGER_THAN_ALL = 'Stronger Than All',
	SUB_ZERO = 'Sub-Zero',
	SWAMP_LAND = 'Swamp Land',
	SWAN = 'Swan',
	SWEET = 'Sweet',
	THIS = 'THIS',
	TANJA = 'Tanja',
	TENGWAR = 'Tengwar',
	TERM = 'Term',
	TEST1 = 'Test1',
	THE_EDGE = 'The Edge',
	THICK = 'Thick',
	THIN = 'Thin',
	THORNED = 'Thorned',
	THREE_POINT = 'Three Point',
	TICKS_SLANT = 'Ticks Slant',
	TICKS = 'Ticks',
	TILES = 'Tiles',
	TINKER_TOY = 'Tinker-Toy',
	TOMBSTONE = 'Tombstone',
	TRAIN = 'Train',
	TREK = 'Trek',
	TSALAGI = 'Tsalagi',
	TUBULAR = 'Tubular',
	TWISTED = 'Twisted',
	TWO_POINT = 'Two Point',
	USA_FLAG = 'USA Flag',
	UNIVERS = 'Univers',
	VARSITY = 'Varsity',
	WAVY = 'Wavy',
	WEIRD = 'Weird',
	WET_LETTER = 'Wet Letter',
	WHIMSY = 'Whimsy',
	WOW = 'Wow',
}

export { Fonts, FigletFonts }
