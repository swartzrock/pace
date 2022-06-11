// import clc from 'cli-color'
// import { stdout } from 'process'
// import { clearLine, cursorTo } from 'readline'
// import * as lib from '../common'
//
// import { TimerDetails, TimerRenderer } from './timer-renderer'
//
// export class PieChart implements TimerRenderer {
// 	readonly pieChartChar = '\u2588'
// 	pieChart = new lib.PieChart()
//
// 	render(details: TimerDetails): void {
// 		const now = new Date()
// 		const pctDone = Math.min(1.0, (now.getTime() - details.start.getTime()) / (details.end.getTime() - details.start.getTime()))
//
// 		const radius = Math.floor(Math.min(process.stdout.rows, process.stdout.columns / 2) / 2) - 2
// 		const symbols = this.pieChartChar + ' '
// 		const pieDetails: lib.PieChartDetails = { symbols: symbols, percentages: [pctDone, 1.0] }
// 		const pieChartTxt = this.pieChart.generate(pieDetails, radius, ' ', ' ')
//
// 		clearLine(stdout, 0)
// 		cursorTo(stdout, 0, 0)
//
// 		let color = clc.xterm(82)
// 		if (pctDone > 0.7) {
// 			color = clc.xterm(154)
// 		}
// 		if (pctDone > 0.9) {
// 			color = clc.xterm(196)
// 		}
// 		const centeredPieChart = lib.Utils.centerTextBlockHorizontallyOnScreen(pieChartTxt)
// 		stdout.write(color(centeredPieChart))
// 	}
// }
