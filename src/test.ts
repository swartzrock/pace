#!/usr/bin/env ts-node

import { Colors, Xterm256 } from './common/colors'
import { PieChart2 } from './renderers/pie2'
import { ALL_RENDERERS, TimerDetails } from './renderers/timer-renderer'
import { Utils } from './common/utils'
import { StringUtils } from './common/stringutils'
import { stdout } from 'process'

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
console.log(`${StringUtils.TextBlocks.addPadding(block, 5, 10, 'O')}`)
// console.log(`matrix = ${StringUtils.textBlockToMatrix(block)}`)
