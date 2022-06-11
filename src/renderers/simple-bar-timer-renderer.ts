import { stdout } from 'process'
import { clearLine, cursorTo } from 'readline'

import { TimerDetails, TimerRenderer } from './timer-renderer'
import { Colors, Xterm256 } from '../common/colors'

class SimpleBarTimerRenderer implements TimerRenderer {
	readonly PROG_BAR_LEN = 40
	readonly barCompleteChar = '\u2588'
	readonly barIncompleteChar = '\u2591'

	render(details: TimerDetails): void {
		const now = new Date()
		const pctDone = Math.min(1.0, (now.getTime() - details.start.getTime()) / (details.end.getTime() - details.start.getTime()))

		clearLine(stdout, 0)
		cursorTo(stdout, 0)

		const barCompleteLen = Math.round(pctDone * this.PROG_BAR_LEN)
		const barEmptyLen = this.PROG_BAR_LEN - barCompleteLen

		const barCompleteStr = ''.padStart(barCompleteLen, this.barCompleteChar)
		const barIncompleteStr = ''.padStart(barEmptyLen, this.barIncompleteChar)

		const pct = `${(pctDone * 100).toFixed(1)}`.padStart(4, ' ')
		const text = `progress | ${barCompleteStr}${barIncompleteStr} | ${pct}%  `
		console.log(Colors.foregroundColor(text, Xterm256.GREEN_3B))
		// const color = clc.xterm(2)
		// stdout.write(color(text))
	}
}

export { SimpleBarTimerRenderer }
