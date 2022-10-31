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

	static info = (a: unknown) => Loggy.enabled && Loggy.mainLog.info(a)
	static warn = (a: unknown) => Loggy.enabled && Loggy.mainLog.warn(a)
	static error = (a: unknown) => Loggy.enabled && Loggy.mainLog.error(a)

	/**
	 * A great utility for printing directly to the raw log. If a StringMatrix is passed, additional
	 * info about the matrix will be printed
	 * @param a
	 */
	static raw(a: unknown) {
		if (!Loggy.enabled) return
		if (a instanceof StringMatrix) {
			const m: StringMatrix = a as StringMatrix
			Loggy.rawLog.info(`Displaying ${m.cols()} x ${m.rows()} matrix:`)
			Loggy.rawLog.info('          1         2         3         4         5         6')
			Loggy.rawLog.info('01234567890123456789012345678901234567890123456789012345678901234567890123456789')
		}
		Loggy.rawLog.info(a)
	}

	private static mainLog = winston.createLogger({
		level: 'info',
		format: winston.format.json(),
		transports: [
			//
			// - Write all logs with importance level of `error` or less to `error.log`
			// - Write all logs with importance level of `info` or less to `combined.log`
			//
			new winston.transports.File({ filename: Loggy.ERROR_LOG_FILE, level: 'error' }),
			new winston.transports.File({ filename: Loggy.COMBINED_LOG_FILE, format: winston.format.simple() }),
		],
	})

	private static rawLog = winston.createLogger({
		level: 'info',
		format: winston.format.printf(({ message }) => {
			return message
		}),
		transports: [new winston.transports.File({ filename: Loggy.RAW_LOG_FILE })],
	})

}

export { Loggy }
