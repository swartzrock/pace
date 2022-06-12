#!/usr/bin/env ts-node

import { Colors, Xterm256 } from './common/colors'
import { PieChart2 } from './renderers/pie2'
import { ALL_RENDERERS, TimerDetails } from './renderers/timer-renderer'
import { Utils } from './common/utils'
import { StringUtils } from './common/stringutils'

const helloColor = Colors.foregroundAndBackgroundColor('Hello, World', Xterm256.SEAGREEN_2, Xterm256.DARKBLUE)
console.log(helloColor)

console.log(Utils.randomElement(Object.values(ALL_RENDERERS)))
console.log(Utils.randomElement([1, 2, 3]))
console.log(Utils.randomElement([1]))
console.log(Utils.randomElement([]))

if (Utils.randomElement([])) {
	console.log('so empty')
}

console.log(StringUtils.setCharAt('Jason', 'O', 0))
console.log(StringUtils.setCharAt('Jason', 'O', 1))
console.log(StringUtils.setCharAt('Jason', 'O', 2))
console.log(StringUtils.setCharAt('Jason', 'O', 3))
console.log(StringUtils.setCharAt('Jason', 'O', 4))

// let k: keyof typeof allRends
// for (k in allRends) {
// 	console.log(k)
// 	console.log(allRends[k])
// }
