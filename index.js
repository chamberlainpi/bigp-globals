require('colors');
const _ = require('lodash');
const cluster = require('cluster');
const svYargs = require('./libs/sv-yargs');
const svExpress = require('./libs/sv-express');
const svWatcher = require('./libs/sv-watcher');

const trace = console.log.bind(console);
const traceClear = function() { process.stdout.write('\033c'); };
const traceError = function(err) { trace(err.toString().red); };

let isStarted = false;

const $$$ = {
	init(opts) {
		if(!opts) opts = {};
		$$$.opts = opts;

		const globals = $$$.globals = {};
		const mods = globals.mods = {};

		// Requires:
		globals._ = _;
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

		// Log:
		globals.trace = trace;
		globals.traceClear = traceClear;
		globals.traceError = traceError;

		if(!opts.noConflict) _.extend(global, globals);
		else trace("*noConflict* mode, use $$$.globals & $$$.globals.mods instead");

		//Some handy extensions built-in types:
		require('./libs/extensions');

		$$$.paths = require('./libs/sv-paths');

		return new Promise((_then, _catch) => {
			if(cluster.isMaster) return $$$.loopMasterProcess();

			$$$.app = svExpress.init($$$);
			$$$.watcher = svWatcher.init($$$);
			$$$.argv = svYargs.init($$$);

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
		if(isStarted) throw 'Already started a child-process!';
		isStarted = true;

		let persistent;

		function loop() {
			if(!persistent) {
				traceClear();
				trace(`MASTER Started child process from PID #${process.pid} ...`);
				persistent = cluster.fork();
			}

			setTimeout(loop, 250);
		}

		cluster.on('exit', (worker, code, signal) => {
			trace(`Worker ${worker.process.pid} died.`);
			persistent = null;
		});

		loop();
	},

	builtInCommand() {
		return 'built-in';
	}
};

// const COMMANDS = {
// 	auto() {
// 		return process.env.NODE_ENV==='prod' ?
// 			COMMANDS.prod() : COMMANDS.dev();
// 	},
//
// 	dev() {
// 		return 'dev';
// 	},
//
// 	prod() {
// 		return 'prod';
// 	},
//
// 	test() {
// 		return 'test';
// 	},
//
// 	xp() {
// 		return 'xp';
// 	}
// };

module.exports = $$$;