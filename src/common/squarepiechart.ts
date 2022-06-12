import { Utils } from './utils'
import { StringUtils } from '../common/stringutils'

type SquarePieChartDetails = {
	symbols: string[]
	percentages: number[]
}

class SquarePieChart {
	generate(details: SquarePieChartDetails, radius: number, background: string, emptyPie: string): string {
		const cells: number[] = Utils.createArrayRange(-radius, radius)

		const matrix: string[][] = new Array(cells.length).fill('').map(() => new Array(cells.length).fill(''))
		for (let y = 0; y < cells.length; y++) {
			for (let x = 0; x < cells.length; x++) {
				const char = this.insideCircle(cells[x], cells[y], radius)
					? this.getSymbolForPosition(details, cells[x], cells[y], emptyPie)
					: background
				matrix[y][x] = char
			}
		}

		this.rotateMatrix90DegreesClockwise(matrix)
		return matrix.map((line) => line.join('')).join('\n')
	}

	private rotateMatrix90DegreesClockwise(matrix: string[][]) {
		const n = matrix.length
		const x = Math.floor(n / 2)
		const y = n - 1
		for (let i = 0; i < x; i++) {
			for (let j = i; j < y - i; j++) {
				const tmp = matrix[i][j]
				matrix[i][j] = matrix[y - j][i]
				matrix[y - j][i] = matrix[y - i][y - j]
				matrix[y - i][y - j] = matrix[j][y - i]
				matrix[j][y - i] = tmp
			}
		}
	}

	private getSymbolForCirclePercentage(
		details: SquarePieChartDetails,
		circlePercentage: number,
		empty: string
	): string {
		for (let i = 0; i < details.percentages.length; i++) {
			const pct = details.percentages[i]
			if (circlePercentage <= pct) {
				return details.symbols[i]
			}
			circlePercentage = circlePercentage - pct
		}
		return empty
	}

	private getSymbolForPosition(details: SquarePieChartDetails, x: number, y: number, empty: string) {
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

export { SquarePieChart, SquarePieChartDetails }
