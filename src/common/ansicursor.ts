import { stdout } from 'process'
import { clearScreenDown, cursorTo } from 'readline'

class AnsiCursor {
	static readonly ANSI_HIDE_CURSOR = '\u001b[?25l'
	static readonly ANSI_SHOW_CURSOR = '\u001b[?25h'

	static hideCursor = () => stdout.write(AnsiCursor.ANSI_HIDE_CURSOR)
	static showCursor = () => stdout.write(AnsiCursor.ANSI_SHOW_CURSOR)

	static renderTopLeft(s: string): void {
		cursorTo(stdout, 0, 0)
		clearScreenDown(stdout)
		console.log(s)
	}
}

export { AnsiCursor }
