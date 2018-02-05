/**
 * Created by Chamberlain on 2/2/2018.
 */
if(typeof process !== 'object') {
	window.trace = console.log.bind(console);
	window.traceError = console.error.bind(console);
}

_.extend(String.prototype, {
	has(key) {
		return this.indexOf(key) > -1;
	},
	fixSlash() {
		return this.replace(/\\/g, '/');
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

var $$$ = $$$ || {};

_.extend($$$, {
	randID() {
		return new Date().getTime().toString(36);
	}
});