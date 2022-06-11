import { StringBuffer } from './stringbuffer'
import { Utils } from './utils'

type PieChartDetails = {
	symbols: string
	percentages: number[]
}

class PieChart {
	generate(details: PieChartDetails, radius: number, background: string, emptyPie: string): string {
		const rows = Utils.createArrayRange(-radius, radius)
		const columns = Utils.createArrayRange(-radius * 2, radius * 2).map((v) => v / 2)

		const buffer = new StringBuffer()
		for (const y of rows) {
			for (const x of columns) {
				const char = this.insideCircle(x, y, radius) ? this.getSymbolForPosition(details, x, y, emptyPie) : background
				buffer.add(char)
			}
			buffer.newline()
		}
		return buffer.toString()
	}

	private getSymbolForCirclePercentage(details: PieChartDetails, circlePercentage: number, empty: string): string {
		for (let i = 0; i < details.percentages.length; i++) {
			const pct = details.percentages[i]
			if (circlePercentage <= pct) {
				return details.symbols[i]
			}
			circlePercentage = circlePercentage - pct
		}
		return empty
	}

	private getSymbolForPosition(details: PieChartDetails, x: number, y: number, empty: string) {
		const circumfPercentage = this.circlePercentageFromNegX(x, y)
		return this.getSymbolForCirclePercentage(details, circumfPercentage, empty)
	}

	private insideCircle(x: number, y: number, r: number): boolean {
		return x ** 2 + y ** 2 < r ** 2
	}

	private circlePercentageFromNegX(x: number, y: number): number {
		return Math.atan2(y, x) / (2 * Math.PI) + 0.5
	}
}

export { PieChart, PieChartDetails }
