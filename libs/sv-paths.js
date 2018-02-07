/**
 * Created by Chamberlain on 2/2/2018.
 */
const path = require('path');
const mkdirp = require('mkdirp');

const paths = {};
const trimSlash = s => s.substr(0, s.lastIndexOf('/'));

paths.filename = process.argv[1].fixSlash();
paths.dir = trimSlash(paths.filename);
paths.cwd = process.cwd().fixSlash();
paths.public = paths.dir + '/public';
paths.internal = {};
paths.internal.filename = __filename.fixSlash();
paths.internal.dir = trimSlash(__dirname.fixSlash());
paths.internal.public = paths.internal.dir + '/public';
paths.mkdirp = function(dir) {
	return new Promise((_then, _catch) => {
		mkdirp(dir, err => {
			if(err) return _catch(err);
			_then(dir);
		});
	});
};

module.exports = paths;