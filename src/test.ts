#!/usr/bin/env ts-node

import { TextBlocks } from './common/textblocks'

const block = `
xxxxxxxxxxxx
xxxxxxxxxxxx
xxxxxxxxxxxx
xxxxxxxxxxxx
`

// const matrix = StringUtils.textBlockToMatrix(block)
// for (let i = 0; i < matrix.length; i++) {
// 	console.log('')
// 	for (let j = 0; j < matrix[i].length; j++) {
// 		stdout.write(`${matrix[i][j]},`)
// 	}
// }
// console.log('')
console.log(`${TextBlocks.addPadding(block, 5, 10, 'O')}`)
// console.log(`matrix = ${StringUtils.textBlockToMatrix(block)}`)
