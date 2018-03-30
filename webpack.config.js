const fs = require('fs-extra');
const webpack = require('webpack');
const path = require('path');
const trace = console.log.bind(console);

module.exports = function($$$) {
	const entryMain = path.resolve($$$.paths.public, "js/entry.js");
	const entryInternal = path.resolve($$$.paths.internal.public, "js/boot.js");
	const entries = [entryMain, entryInternal].filter(fs.existsSync);

	return {
		entry: {
			bundle: entries
		},

		output: {
			path: path.resolve(__dirname, "./public"),
			filename: "[name].js"
		},

		module: {
			loaders: [
				{ test: /\.css$/, loader: "style!css" }
			]
		}
	};
};