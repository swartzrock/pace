#!/usr/bin/env ts-node

import { Colors, Xterm256 } from './common/colors'

const helloColor = Colors.foregroundAndBackgroundColor('Hello, World', Xterm256.SEAGREEN_2, Xterm256.DARKBLUE)
console.log(helloColor)
