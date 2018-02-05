/**
 * Created by Chamberlain on 2/2/2018.
 */
const express = require('express');
const app = express();
const http = require('http').Server(app);

const SELF = module.exports = {
	init($$$) {
		$$$.server = SELF;
		$$$.http = http;
		$$$.app = app;

		const opts = SELF.opts = $$$.opts.server || {};

		if(!opts.port) opts.port = 3333;
		if(opts.isHelloWorld) app.get('/', (req, res) => res.send('Hello World!'));

		app.get('/*', express.static($$$.paths.public));
		app.get('/*', express.static($$$.paths.internal.public));
		app.get('/js/extensions.js', SELF.serveFile(__dirname + '/extensions.js'));

		if(opts.isAutoStart!==false) {
			const delay = opts.delay || 1;
			trace(`Auto-Starting server in ${delay}ms ...`);

			setTimeout(SELF.start, delay);
		}
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