/**
 * Created by Chamberlain on 2/2/2018.
 */

var isNode = typeof window !== 'object';
var GLOBALS = isNode ? global : window;

function init($$$) {
	GLOBALS.trace = console.log.bind(console);
	GLOBALS.traceError = console.error.bind(console);
	GLOBALS.traceClear = isNode ?
		function() { process.stdout.write('\033c'); } :
		console.clear.bind(console);

	_.extend(String.prototype, {
		has(key) {
			return this.indexOf(key) > -1;
		},
		fixSlash() {
			return this.replace(/\\/g, '/');
		},
		mustEndWith(str) {
			return !this.endsWith(str) ? this + str : this;
		},
		toPath() {
			var split = this.split('/');
			return { filename: split.pop(), dir: split.join('/') };
		}
	});

	_.extend(Array.prototype, {
		has(key) {
			return this.indexOf(key) > -1;
		},
		remove(item) {
			var id = this.indexOf(item);
			if(id===-1) return false;
			this.splice(id, 1);
			return true;
		}
	});

	_.extend($$$, {
		randID() {
			return new Date().getTime().toString(36);
		}
	});
}

if(isNode) {
	module.exports = {init: init};
} else {
	init($$$);
}
