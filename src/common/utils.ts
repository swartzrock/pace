class Utils {
	static halfInt = (n: number): number => Math.floor(n / 2)

	static createArrayRange(start: number, end: number): number[] {
		const total = end - start + 1
		return Array.from(Array(total)).map((_, i) => start + i)
	}

	static randomElement<T>(a: Array<T>): T | null {
		if (a.length == 0) {
			return null
		}
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
}

export { Utils }
