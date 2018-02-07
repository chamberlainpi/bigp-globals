/**
 * Created by Chamberlain on 2/7/2018.
 */

const templateFiles = require('../template.config');
const fs = require('fs-extra');
const path = require('path');

const SELF = module.exports = {
	init($$$) {
		$$$.mods.svSocketIO.addEvent('copy-template', copyFiles);

		function copyFiles() {
			const files = templateFiles.files;

			files.forEach( file => {
				const filepath = path.join($$$.paths.internal.dir, file).fixSlash();
				const newpath = path.join($$$.paths.dir, file).fixSlash();

				if(!fs.existsSync(filepath)) {
					return traceError(" MISSING FILE ".bgRed.white + file);
				}

				trace(newpath.green);

				let txt;
				fs.readFile(filepath, 'utf8')
					.then(content => {
						txt = content.replaceBetween('[preview-start]', '[preview-end]');

						const dir = newpath.toPath().dir;
						trace(dir);
						return $$$.paths.mkdirp(dir);
					})
					.then(() => {
						fs.writeFile(newpath, txt, 'utf8');
					})
					.catch(err => {
						traceError(err);
					});
			});
		}
	}
}