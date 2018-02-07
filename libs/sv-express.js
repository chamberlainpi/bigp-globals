/**
 * Created by Chamberlain on 2/2/2018.
 */
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

		app.get('/*', SELF.serveMemoryFile);
		app.get('/*', SELF.serveStaticWithPreview($$$.paths.public));
		app.get('/*', SELF.serveStaticWithPreview($$$.paths.internal.public));
		app.get('/js/extensions.js', SELF.serveFile(__dirname + '/extensions.js'));

		if(opts.isAutoStart!==false) {
			const delay = opts.delay || 1;
			trace(`Auto-Starting server in ${delay}ms ...`);

			setTimeout(SELF.start, delay);
		}
	},

	serveStaticWithPreview(path) {
		const serveStatic = express.static(path);

		return (req, res, next) => {
			// const res_sendFile = res.sendFile;
			// const res_send = res.send;
			// const res_write = res.write;
			// const res_end = res.end;
			//
			// _.assign(res, {
			// 	sendFile() {
			// 		trace("Sending file: " + arguments);
			// 		res_sendFile.apply(res, arguments);
			// 	},
			// 	sendfile() {
			// 		trace("Sending file: " + arguments);
			// 		res_sendFile.apply(res, arguments);
			// 	},
			// 	send(a, b, c) {
			// 		trace("Sending data: " + arguments);
			// 		res_send.apply(res, arguments);
			// 	},
			// 	write() {
			// 		trace("Writing data: " + arguments);
			// 		res_write.apply(res, arguments);
			// 	},
			// 	end() {
			// 		trace(_.keys(this));
			// 		res_end.apply(res, arguments);
			// 	}
			// });

			//trace(path + req.url);
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

		const urlObj = new urlparse(req.get('referer'), null, true);

		memPaths.forEach(mp => {
			if(usedMP || !mp.split('/').pop().has('.') || !$$$.memFS.existsSync(mp)) return;

			usedMP = true;

			//trace("Memory serving: " + url);

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