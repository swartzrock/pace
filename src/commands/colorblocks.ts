import { Command } from '@oclif/core'

export default class ColorBlocks extends Command {
	static description = 'Displays an xterm color block pattern'

	static examples = [
		`pace colorblocks
`,
	]

	static flags = {}
	static args = []
	static strict = true

	async run(): Promise<void> {
		console.log('hey')
	}
}
