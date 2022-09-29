import * as _ from 'lodash'

class Utils {
	static halfInt = (n: number): number => Math.floor(n / 2)

	static createArrayRange(start: number, end: number): number[] {
		const total = end - start + 1
		return Array.from(Array(total)).map((_, i) => start + i)
	}

	static isEmpty<A>(a: Array<A>): boolean {
		return a != null && a.length > 0
	}

	static randomElement<A>(a: Array<A>): A | null {
		return this.isEmpty(a) ? null : this.randomElementNonEmpty(a)
	}

	static randomElementNonEmpty<A>(a: Array<A>): A {
		return a[Math.floor(Math.random() * a.length)]
	}

	static grouped<A>(a: Array<A>, groupSize: number): Array<Array<A>> {
		const result = new Array<Array<A>>()
		for (let i = 0; i < a.length; i += groupSize) {
			result.push(a.slice(i, i + groupSize))
		}

		return result
	}

	static transpose<A>(matrix: Array<Array<A>>): Array<Array<A>> {
		return matrix[0].map((col, i) => matrix.map((row) => row[i]))
	}

	/**
	 * Returns the array plus a reverse copy of the array, concatenated
	 * @param a the array to duplicate
	 */
	static concatReversed<A>(a: Array<A>): Array<A> {
		return a.concat(a.reverse())
	}

	static fill<A>(a: A, count: number): Array<A> {
		const result = new Array<A>(count)
		for (let i = 0; i < count; i++) {
			result[i] = _.clone(a)
		}
		return result
	}

	static rotateLeft<A>(a: Array<A>) {
		const first = a.shift()
		if (first !== undefined) {
			a.push(first)
		}
	}

	static rotateRight<A>(a: Array<A>) {
		a.reverse()
		Utils.rotateLeft(a)
		a.reverse()
	}

	static head<A>(a: Array<A>): A | null {
		return a === null || a.length == 0 ? null : a[0]
	}
}

export { Utils }
