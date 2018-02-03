/**
 * Created by Chamberlain on 2/2/2018.
 */
const opn = require('opn');
const moment = require('moment');
const MAX_TIME_TO_OPEN = 2500;
let lastChecked = moment();

let SELF;
module.exports = SELF = {
	init($$$) {
		SELF.url = 'http://localhost:' + $$$.server.opts.port;
		SELF.io = $$$.io;

		$$$.mods.svSocketIO.addEvent('check', function() {
			lastChecked = moment();
		});

		setTimeout(SELF.checkIfNeedsToOpen, MAX_TIME_TO_OPEN);
	},

	checkIfNeedsToOpen() {
		const ms = moment().diff(lastChecked, 'milliseconds');
		if(ms < MAX_TIME_TO_OPEN) return SELF.io.emit('already-opened');
		trace(`Opening project in browser (ms: ${ms})...`.cyan);
		opn(SELF.url);
	}
};