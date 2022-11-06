import {Utils} from "./utils";
import {Point} from "./point";

class Rectangle {
	constructor(public left: number, public top: number, public right: number, public bottom: number) {}
	contains(p: Point) {
		return Utils.between(p.col, this.left, this.right) && Utils.between(p.row, this.top, this.bottom)
	}
	toString(): string {
		return `Rectangle(${this.left}, ${this.top}, ${this.right}, ${this.bottom})`
	}
}

export { Rectangle }
