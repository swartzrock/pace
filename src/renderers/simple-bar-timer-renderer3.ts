import { Colors, Xterm256 } from '../common/colors'

import { TimerDetails, TimerRenderer } from './timer-renderer'
import { StringUtils } from '../common/stringutils'

class SimpleBarTimerRenderer3 implements TimerRenderer {
	readonly BAR_COMPLETE_CHAR = '\u2588'
	readonly BAR_INCOMPLETE_CHAR = '\u2591'
	readonly BAR_COMPLETE_START_CHAR = '\u25d6'
	readonly BAR_COMPLETE_END_CHAR = '\u25d7'
	readonly RIGHT_MARGIN = 2

	render(details: TimerDetails): void {
		const fgColor: Xterm256 = this.fgColor(details.percentDone)
		const colorBarComplete = Colors.foregroundColor(this.BAR_COMPLETE_CHAR, fgColor)
		const colorBarIncomplete = Colors.foregroundColor(this.BAR_INCOMPLETE_CHAR, Xterm256.GREY_030)

		const matrix = this.renderMonoProgressBarMatrix(details)
		StringUtils.StringMatrix.replaceAll(matrix, this.BAR_COMPLETE_CHAR, colorBarComplete)
		StringUtils.StringMatrix.replaceAll(matrix, this.BAR_INCOMPLETE_CHAR, colorBarIncomplete)

		const text = StringUtils.StringMatrix.toString(matrix)
		console.log(text)
	}

	renderMonoProgressBarMatrix(details: TimerDetails): string[][] {
		return StringUtils.TextBlocks.toString2dArray(this.renderMonoProgressBar(details))
	}

	renderMonoProgressBar(details: TimerDetails): string {
		const progressBarDetailLength = this.renderBar('', '', '000:00', '99.9').length
		const progressBarLength = process.stdout.columns - progressBarDetailLength - this.RIGHT_MARGIN

		const barCompleteLen = Math.round(details.percentDone * progressBarLength)
		const barEmptyLen = progressBarLength - barCompleteLen

		const barCompleteStr = StringUtils.fillString(this.BAR_COMPLETE_CHAR, barCompleteLen)
		const barIncompleteStr = StringUtils.fillString(this.BAR_INCOMPLETE_CHAR, barEmptyLen)

		const timeElapsed = this.renderTimeElapsed(details)
		const timeRemaining = this.renderTimeRemaining(details)

		return this.renderBar(barCompleteStr, barIncompleteStr, timeElapsed, timeRemaining)
	}

	renderBar(barComplete: string, barIncomplete: string, timeElapsed: string, timeRemaining: string): string {
		return `${timeElapsed} | ${barComplete}${barIncomplete} | ${timeRemaining} `
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

	private renderTimeElapsed(details: TimerDetails): string {
		const elapsedSeconds = Math.floor((new Date().getTime() - details.start.getTime()) / 1000)
		const elapsedMinutes: number = Math.floor(elapsedSeconds / 60)
		const elapsedSecondsInMinute: number = elapsedSeconds - elapsedMinutes * 60
		return `${elapsedMinutes}:` + `${elapsedSecondsInMinute}`.padStart(2, '0')
	}

	private renderTimeRemaining(details: TimerDetails): string {
		const remainingMinutes: number = Math.floor(details.remainingSeconds / 60)
		const remainingSecondsInMinute: number = details.remainingSeconds - remainingMinutes * 60
		const timeRemaining = `${remainingMinutes}:` + `${remainingSecondsInMinute}`.padStart(2, '0')
		return timeRemaining
	}
}

export { SimpleBarTimerRenderer3 }
