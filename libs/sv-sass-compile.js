/**
 * Created by Chamberlain on 2/5/2018.
 */
const sass = require('node-sass');
const path = require('path');
const sassRegex = /\.s(a|c)ss$/;

const SELF = module.exports = {
	init($$$) {
		$$$.mods.svWatcher.add(sassRegex, '*', path => renderInMemory(path));

		function renderInMemory(dir) {
			const cssPath = path.resolve(dir.replace(sassRegex, '.css')).fixSlash();
			const cssDir = cssPath.toPath().dir;

			$$$.memFS.mkdirpSync(cssDir);

			sass.render({file: dir}, (err, result) => {
				if(err) throw err;

				$$$.memFS.writeFile(cssPath, result.css, onSassComplete);
			});

			function onSassComplete(err) {
				if(err) throw err;

				$$$.io.emit('file-changed', cssPath);
			}
		}
	},
};