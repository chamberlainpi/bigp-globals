/**
 * Created by Chamberlain on 2/2/2018.
 */
const express = require('express');
const app = express();

const SELF = {
	init($$$) {
		$$$.server = SELF;

		const opts = SELF.opts = $$$.opts.server || {};

		if(opts.isHelloWorld) app.get('/', (req, res) => res.send('Hello World!'));

		app.get('/', express.static($$$.paths.public));
		app.get('/', express.static($$$.paths.internal.public));

		if(opts.isAutoStart!==false) {
			const delay = opts.delay || 250;
			trace(`Auto-Starting server in ${delay}ms ...`);

			setTimeout(SELF.start, delay);
		}

		return app;
	},

	start() {
		const opts = SELF.opts;
		const port = opts.port || 3333;
		trace(opts);
		app.listen(port, () => console.log(`Server started on port ${port}!`.bgYellow.black));
	}
};

module.exports = SELF;