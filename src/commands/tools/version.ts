import {Command} from '@oclif/core'

class Version extends Command {
	static description = 'Displays the Pace version'
	static examples = ['pace tools version']
	static strict = true

	async run(): Promise<void> {
		console.log(this.config.version)
	}
}

export { Version }
