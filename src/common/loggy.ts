import winston from 'winston'
import {StringMatrix} from './stringmatrix'

/**
 * Logging class, really useful for debugging
 */
class Loggy {
	private static readonly ERROR_LOG_FILE = 'logs/error.log'
	private static readonly COMBINED_LOG_FILE = 'logs/combined.log'
	private static readonly RAW_LOG_FILE = 'logs/raw.log'

	private static enabled = false

	static enable() {
		Loggy.enabled = true
	}

	static info = (a: unknown) => Loggy.enabled && Loggy.getMainLogger().info(a)
	static warn = (a: unknown) => Loggy.enabled && Loggy.getMainLogger().warn(a)
	static error = (a: unknown) => Loggy.enabled && Loggy.getMainLogger().error(a)

	/**
	 * A great utility for printing directly to the raw log. If a StringMatrix is passed, additional
	 * info about the matrix will be printed
	 * @param a
	 */
	static raw(a: unknown) {
		if (!Loggy.enabled) return
		if (a instanceof StringMatrix) {
			const m: StringMatrix = a as StringMatrix
			Loggy.getRawLogger().info(`Displaying ${m.cols()} x ${m.rows()} matrix:`)
			Loggy.getRawLogger().info('          1         2         3         4         5         6')
			Loggy.getRawLogger().info('01234567890123456789012345678901234567890123456789012345678901234567890123456789')
		}
		Loggy.getRawLogger().info(a)
	}

	private static _mainLog: winston.Logger
	private static _rawLog: winston.Logger

	private static getMainLogger(): winston.Logger {
		if (!this._mainLog) {
			this._mainLog = winston.createLogger({
				level: 'info',
				format: winston.format.json(),
				transports: [
					new winston.transports.File({ filename: Loggy.ERROR_LOG_FILE, level: 'error' }),
					new winston.transports.File({ filename: Loggy.COMBINED_LOG_FILE, format: winston.format.simple() }),
				],
			})
		}

		return this._mainLog
	}

	private static getRawLogger(): winston.Logger {
		if (!this._rawLog) {
			this._rawLog = winston.createLogger({
				level: 'info',
				format: winston.format.printf(({ message }) => {
					return message
				}),
				transports: [new winston.transports.File({ filename: Loggy.RAW_LOG_FILE })],
			})
		}

		return this._rawLog
	}


}

export { Loggy }
