class Rectangle {
	constructor(public left: number, public top: number, public right: number, public bottom: number) {}
	toString(): string {
		return `Rectangle(${this.left}, ${this.top}, ${this.right}, ${this.bottom})`
	}
}

export { Rectangle }
