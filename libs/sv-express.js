/**
 * Created by Chamberlain on 2/2/2018.
 */
const fs = require('fs-extra');
const mime = require('mime-types');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const urlparse = require('url-parse');

const SELF = module.exports = {
	init($$$) {
		SELF.$$$ = $$$;
		$$$.server = SELF;
		$$$.http = http;
		$$$.app = app;

		const opts = SELF.opts = $$$.opts.server || {};

		if(!opts.port) opts.port = 3333;
		if(opts.isHelloWorld) app.get('/', (req, res) => res.send('Hello World!'));

		app.get('/*', SELF.serveStaticWithPreview($$$.paths.public));
		app.get('/*', SELF.serveStaticWithPreview($$$.paths.internal.public));
		app.get('/*', SELF.serveMemoryFile);
		app.get('/js/extensions.js', SELF.serveFile(__dirname + '/extensions.js'));

		if(opts.isAutoStart!==false) {
			const delay = opts.delay || 1;
			trace(`Auto-Starting server in ${delay}ms ...`);

			setTimeout(SELF.start, delay);
		}
	},

	resolvePath(req, path) {
		const url = req.url.split('?')[0];
		return path + (url.endsWith('/') ? url + '/index.html' : url);
	},

	serveStaticWithPreview(path) {
		const serveStatic = express.static(path);
		const memFS = SELF.$$$.memFS;

		return (req, res, next) => {
			const url = new urlparse(req.get('referrer'), null, true);
			const isPreview = url.query.preview || req.query.preview ? 'preview' : null;

			if(!isPreview) return serveStatic(req, res, next);

			const filepath = SELF.resolvePath(req, path);
			const filename = filepath.split('/').pop();
			const mimeType = mime.lookup(filename);

			const isFound = fs.existsSync(filepath) ? fs :
				(memFS.existsSync(filepath) ? memFS : null);

			if(isFound && mimeType.has('text/', '/javascript')) {
				return isFound.readFile(filepath, 'utf8', onFileOpen);
			}

			function onFileOpen(err, content) {
				var contentClean = content.replaceBetween(`[${isPreview}-start]`, `[${isPreview}-end]`)

				res.contentType(mimeType);
				res.send(contentClean);
			}

			serveStatic(req, res, next);
		}
	},

	serveMemoryFile(req, res, next) {
		let usedMP = false;
		const url = req.url.split('?')[0];
		const $$$ = SELF.$$$;
		const memPaths = [
			$$$.paths.public + url,
			$$$.paths.internal.public + url
		];

		memPaths.forEach(mp => {
			if(usedMP || !mp.split('/').pop().has('.') || !$$$.memFS.existsSync(mp)) return;

			usedMP = true;

			res.contentType(mime.lookup(mp));
			res.send($$$.memFS.readFileSync(mp));
		});

		if(!usedMP) next();
	},

	serveFile(filename) {
		return (req, res) => res.sendFile(filename);
	},

	start() {
		const opts = SELF.opts;

		http.listen(opts.port, () => console.log(`Server started on port ${opts.port}!`.yellow));
		//app.listen(opts.port, () => console.log(`Server started on port ${opts.port}!`.yellow));
	}
};