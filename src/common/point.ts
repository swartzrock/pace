class Point {
	constructor(public col: number, public row: number) {}
	toString(): string {
		return `Point(${this.col}, ${this.row})`
	}
}

export { Point }
