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
}

export { Utils }
