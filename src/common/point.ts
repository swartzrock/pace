class Point {
	constructor(public col: number, public row: number) {}
	plus(p: Point) {
		this.col = this.col + p.col
		this.row = this.row + p.row
	}
	toString(): string {
		return `Point(${this.col}, ${this.row})`
	}
}

export { Point }
