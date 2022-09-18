import { StringUtils } from './stringutils'
import { StringMatrix } from './stringmatrix'

class TestUtils {
	static simpleMatrix(cols: number, rows: number, fillChar?: string): StringMatrix {
		const fill = fillChar ?? '.'

		const lines: string[] = []
		for (let i = 0; i < rows; i++) {
			lines.push(StringUtils.fillString(fill, cols))
		}
		return StringMatrix.fromMultilineMonochromeString(lines.join('\n'))
	}
}

export { TestUtils }
