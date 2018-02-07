/**
 * Created by Chamberlain on 2/5/2018.
 */
const sass = require('node-sass');
const path = require('path');
const fs = require('fs-extra');
const sassRegex = /\.s(a|c)ss$/;

const SELF = module.exports = {
	init($$$) {
		$$$.mods.svWatcher.add(sassRegex, '*', path => renderInMemory(path));

		const cssShared = $$$.paths.internal.public + '/css';
		const cssStyles = $$$.paths.public + '/css/styles.scss';
		const cssInternal = cssShared + '/styles.scss';

		const cssEntries = [cssStyles, cssInternal];

		function renderInMemory(dir) {
			const cssEntry = cssEntries.find(entry => fs.existsSync(entry));
			if(!cssEntry) throw 'No CSS entry found.';

			const cssPath = path.resolve(cssEntry.replace(sassRegex, '.css')).fixSlash();

			$$$.memFS.mkdirpSync(cssPath.toPath().dir);

			sass.render({file: cssEntry, includePaths: [cssShared]},
				(err, result) => {
					if(err) throw err;

					$$$.memFS.writeFile(cssPath, result.css, onSassComplete);
				}
			);

			function onSassComplete(err) {
				if(err) throw err;

				$$$.io.emit('file-changed', cssPath);
			}
		}
	},
};