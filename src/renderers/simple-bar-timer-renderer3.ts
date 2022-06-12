import { stdout } from 'process'
import { clearLine, cursorTo } from 'readline'
import { Colors, Xterm256 } from '../common/colors'

import { TimerDetails, TimerRenderer } from './timer-renderer'
import { StringUtils } from '../common/stringutils'

class SimpleBarTimerRenderer3 implements TimerRenderer {
	// readonly PROG_BAR_LEN = 30
	readonly BAR_COMPLETE_CHAR = '\u2588'
	readonly BAR_INCOMPLETE_CHAR = '\u2591'
	readonly BAR_COMPLETE_START_CHAR = '\u25d6'
	readonly BAR_COMPLETE_END_CHAR = '\u25d7'
	readonly RIGHT_MARGIN = 2

	render(details: TimerDetails): void {
		const progressBarDetailLength = this.renderBar('', '', '000:00', '99.9').length
		const progressBarLength = process.stdout.columns - progressBarDetailLength - this.RIGHT_MARGIN

		const barCompleteLen = Math.round(details.percentDone * progressBarLength)
		const barEmptyLen = progressBarLength - barCompleteLen

		const barCompleteStr = StringUtils.fillString(this.BAR_COMPLETE_CHAR, barCompleteLen)
		const barIncompleteStr = StringUtils.fillString(this.BAR_INCOMPLETE_CHAR, barEmptyLen)

		const timeRemaining = this.renderTimeRemaining(details)

		const pct = `${(details.percentDone * 100).toFixed(1)}`.padStart(4, ' ')
		const text = this.renderBar(barCompleteStr, barIncompleteStr, timeRemaining, pct)

		const color: Xterm256 = this.fgColor(details.percentDone)

		clearLine(stdout, 0)
		cursorTo(stdout, 0, 0)
		console.log(Colors.foregroundColor(text, color))
	}

	renderBar(barComplete: string, barIncomplete: string, timeRemaining: string, percent: string): string {
		return `${barComplete}${barIncomplete} | ${timeRemaining} | ${percent}% `
	}

	fgColor(percentDone: number): Xterm256 {
		if (percentDone > 0.9) {
			return Xterm256.ORANGERED_1
		}
		if (percentDone > 0.7) {
			return Xterm256.GREENYELLOW
		}
		return Xterm256.CHARTREUSE_2A
	}

	private renderTimeRemaining(details: TimerDetails): string {
		const remainingMinutes: number = Math.floor(details.remainingSeconds / 60)
		const remainingSecondsInMinute: number = details.remainingSeconds - remainingMinutes * 60
		const timeRemaining = `${remainingMinutes}:` + `${remainingSecondsInMinute}`.padStart(2, '0')
		return timeRemaining
	}
}

export { SimpleBarTimerRenderer3 }
