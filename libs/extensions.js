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
		has() {
			for(var a=0; a<arguments.length;a++) {
				const key = arguments[a];
				if(this.indexOf(key) > -1) return true;
			}
			return false;
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
		},
		replaceBetween(tagStart, tagEnd, cbReplace, sep='\n') {
			let idStart, idEnd, lineOffset = 0;
			const lines = this.split(sep);
			const findNextIndex = tag => (line, i) => i>=lineOffset && line.has(tag);
			const findStart = findNextIndex(tagStart);
			const findEnd = findNextIndex(tagEnd);
			const ranges = [];

			do {
				idStart = lines.findIndex(findStart);
				idEnd = lines.findIndex(findEnd);

				if(idStart<0 || idEnd<0 || idStart===idEnd) break;

				if(idStart>idEnd) {
					traceError(`Start and End tags are in == or reverse order: ${idStart} > ${idEnd} in...\n` + lines[0] + '...');
					break;
				}

				lineOffset = idEnd + 1;

				ranges.push({idStart, idEnd, diff: idEnd-idStart+1});

			} while(idStart>-1 && idEnd>-1);

			for(let r=ranges.length; --r>=0;) {
				let range = ranges[r];
				if(cbReplace) {
					cbReplace(lines, range);
				} else {
					lines.splice(range.idStart, range.diff);
				}
			}

			return lines.join(sep);
		}
	});

	_.extend(Array.prototype, {
		has() {
			for(var a=0; a<arguments.length;a++) {
				const key = arguments[a];
				if(this.indexOf(key) > -1) return true;
			}
			return false;
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
