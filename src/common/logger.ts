import winston from 'winston'
import { StringMatrix } from './stringmatrix'
import { StringUtils } from './stringutils'

class Logger {
	static mainLog = winston.createLogger({
		level: 'info',
		format: winston.format.json(),
		transports: [
			//
			// - Write all logs with importance level of `error` or less to `error.log`
			// - Write all logs with importance level of `info` or less to `combined.log`
			//
			new winston.transports.File({ filename: 'error.log', level: 'error' }),
			new winston.transports.File({ filename: 'combined.log', format: winston.format.simple() }),
		],
	})
	static rawLog = winston.createLogger({
		level: 'info',
		format: winston.format.printf(({ message }) => {
			return message
		}),
		transports: [new winston.transports.File({ filename: 'raw.log' })],
	})

	static info = (a: any) => Logger.mainLog.info(a)
	static warn = (a: any) => Logger.mainLog.warn(a)
	static error = (a: any) => Logger.mainLog.error(a)

	static linefill = StringUtils.fillString('=', 20)
	static raw(a: any) {
		// Logger.rawLog.info(this.linefill + ' ' + new Date() + ' ' + this.linefill)
		if (a instanceof StringMatrix) {
			const m: StringMatrix = a as StringMatrix
			Logger.rawLog.info(`Displaying ${m.cols()} x ${m.rows()} matrix:`)
			Logger.rawLog.info('          1         2         3         4         5         6')
			Logger.rawLog.info('01234567890123456789012345678901234567890123456789012345678901234567890123456789')
			// Logger.rawLog.info(m.matrix.slice(0, 2))
		}
		Logger.rawLog.info(a)
	}
}

export { Logger }
