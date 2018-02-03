/**
 * Created by Chamberlain on 10/27/2017.
 */

const chokidar = require('chokidar');
const anymatch = require('anymatch');
const hasPublic = p => p.has('public');
const watchHandlers = [];
const config = {
	ignored: [/node_modules/, /package\.json/, /\.(git|idea|private|gitignore|lock)/] // /(^|[\/\\])\../,
};

let SELF;
module.exports = SELF = {
	init($$$) {
		const opts = $$$.opts.watcher || {};
		if(!opts.dir) opts.dir = $$$.paths.dir || '.';

		SELF.watcher = chokidar.watch(opts.dir, config);
		SELF.watcher.on('all', (event, path) => {
			path = path.fixSlash();

			watchHandlers.forEach(w => {
				const isEventOK = w.event==='*' || w.event===event;
				if(!isEventOK || !w.matcher(path)) return;
				w.cb(path);
			});
		});

		SELF.add(/\./, path => {
			if(hasPublic(path)) {
				$$$.io.emit('file-changed', path);
			} else {
				process.kill(process.pid);
			}
		});
	},

	add(pattern, event, cb) {
		if (arguments.length === 2) {
			cb = event;
			event = 'change'
		}

		watchHandlers.push({matcher: anymatch(pattern), event: event, cb: cb})
	}
};
