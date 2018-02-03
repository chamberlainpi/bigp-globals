/**
 * Created by Chamberlain on 2/1/2018.
 */
const yargs = require('yargs');

module.exports = {
	init($$$) {
		const opts = $$$.opts;

		$$$.argv = yargs
			.version(opts.version || '1.0.0')
			.help('help')
			.alias('c', 'command')
			.describe('c', 'set the command to start the process.')
			.choices('c', ['auto', 'dev', 'prod', 'test', 'xp'])
			.default('c', opts.defaultCmd || 'auto')
			.argv;
	}
};