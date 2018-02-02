/**
 * Created by Chamberlain on 10/27/2017.
 */

const chokidar = require('chokidar');
const anymatch = require('anymatch');
const hasPublic = p => p.has('public');
const watchers = [];
const config = {
	ignored: [/node_modules/, /package\.json/, /\.(git|idea|private|gitignore|lock)/] // /(^|[\/\\])\../,
};

const SELF = {
	init($$$) {
		const opts = $$$.opts.watcher || {};
		if(!opts.dir) opts.dir = $$$.paths.dir || '.';

		trace("FILE-WATCHER: ".yellow + opts.dir);

		SELF.watcher = chokidar.watch(opts.dir, config);
		SELF.watcher.on('all', (event, path) => {
			path = path.fixSlash();

			watchers.forEach(w => {
				var isEventOK = w.event==='*' || w.event===event;
				if(!isEventOK || !w.matcher(path)) return;
				w.cb(path);
			});
		});

		SELF.add(/\./, path => {
			if(hasPublic(path)) {
				//TODO:
				// REPLACE opts by $$$, pass that object around instead!!!!
			} else {
				process.kill(process.pid);
			}
		});

		return this;
	},

	add(pattern, event, cb) {
		if (arguments.length === 2) {
			cb = event;
			event = 'change'
		}

		watchers.push({matcher: anymatch(pattern), event: event, cb: cb})
	}
};

module.exports = SELF;
