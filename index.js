const _ = global._ = require('lodash');
const cluster = require('cluster');

const mods = {};
mods.crypto = require('crypto');
mods.events = require('events');
mods.anymatch = require('anymatch');
mods.async = require('async');
mods.chokidar = require('chokidar');
mods.changeCase = require('change-case');
mods.chai = require('chai');
mods.mocha = require('mocha');
mods.morgan = require('morgan');
mods.fs = require('fs-extra');
mods.fsMem = require('memory-fs');
mods.express = require('express');
mods.expressSession = require('express-session');
mods.cors = require('cors');
mods.mkdirp = require('mkdirp');
mods.moment = require('moment');
mods.request = require('request-promise');
mods.socketIO = require('socket.io');
mods.webpack = require('webpack');
mods.yargs = require('yargs');
mods.MFS = require('memory-fs');

const $$$ = new mods.events();

require('colors');
require('./libs/extensions').init($$$);

const internalMods = [
	mods.svYargs = require('./libs/sv-yargs'),
	mods.svExpress = require('./libs/sv-express'),
	mods.svWatcher = require('./libs/sv-watcher'),
	mods.svSocketIO = require('./libs/sv-socket-io'),
	mods.svAutoOpen = require('./libs/sv-auto-open'),
	mods.svSassCompile = require('./libs/sv-sass-compile'),
	mods.svWebpack = require('./libs/sv-webpack'),
	mods.sv1stTime = require('./libs/sv-1st-time'),
];

module.exports = _.extend($$$, {
	memFS: new mods.MFS(),
	isStarted: false,

	init(opts) {
		if(!opts) opts = {};
		$$$.opts = opts;

		const globals = $$$.globals = {};
		globals._ = _;
		globals.mods = $$$.mods = mods;

		if(!opts.noConflict) _.extend(global, globals);
		else trace("*noConflict* mode, use $$$.globals & $$$.globals.mods instead");

		$$$.paths = require('./libs/sv-paths');

		return new Promise((_then, _catch) => {
			if(cluster.isMaster) return $$$.loopMasterProcess();

			internalMods.forEach(mod => mod.init($$$));

			let cmd;
			if(opts.commands) {
				cmd = opts.commands[$$$.argv.command];
				if(!cmd) throw "Selected an invalid command: " + $$$.argv.command;
			} else {
				cmd = $$$.builtInCommand;
			}

			opts.cmdResult = cmd();

			_then(opts.cmdResult);
		});
	},

	loopMasterProcess() {
		if($$$.isStarted) throw 'Already started a child-process!';
		$$$.isStarted = true;

		let persistent;

		function loop() {
			if(!persistent) {
				traceClear();
				trace(`MASTER Started child process from PID #${process.pid} ...`);
				persistent = cluster.fork();
			}

			setTimeout(loop, 100);
		}

		cluster.on('exit', (worker, code, signal) => {
			trace(`Worker ${worker.process.pid} died (code ${code})`);

			if(code > 0 && $$$.opts.isSlowRefresh) {
				setTimeout(() => persistent = null, 2000);
			}  else {
				persistent = null;
			}
		});

		loop();
	},

	builtInCommand() {
		return 'built-in';
	}
});