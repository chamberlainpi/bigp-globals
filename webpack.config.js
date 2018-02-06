const fs = require('fs-extra');
const webpack = require('webpack');
const path = require('path');
const trace = console.log.bind(console);

module.exports = function($$$) {
	const publicCustom = path.resolve($$$.paths.public, "js/entry.js");
	const publicInternal = path.resolve($$$.paths.internal.public, "js/entry.js");
	let entries = [publicCustom, publicInternal];

	entries = entries.filter(entry => fs.existsSync(entry));

	trace("Existing entries:\n" + entries);

	return {
		entry: {
			bundle: entries
		},

		output: {
			path: path.resolve(__dirname, "./public"),
			filename: "[name].js"
		},

		devServer: {
			publicPath: "/public",
			contentBase: "./web-dashboard",
			hot: false,
			inline: false
		},

		module: {
			loaders: [
				{ test: /\.css$/, loader: "style!css" }
			]
		}
	};
};