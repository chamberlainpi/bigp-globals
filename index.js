require('colors');
const _ = require('lodash');
const cluster = require('cluster');

const trace = console.log.bind(console);
const traceClear = function() { process.stdout.write('\033c'); };
const traceError = function(err) { trace(err.toString().red); };

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

const internalMods = [
	mods.svYargs = require('./libs/sv-yargs'),
	mods.svExpress = require('./libs/sv-express'),
	mods.svWatcher = require('./libs/sv-watcher'),
	mods.svSocketIO = require('./libs/sv-socket-io'),
	mods.svAutoOpen = require('./libs/sv-auto-open'),
];

let isStarted = false;

const $$$ = {
	init(opts) {
		if(!opts) opts = {};
		$$$.opts = opts;

		const globals = $$$.globals = {};
		globals._ = _;
		globals.mods = $$$.mods = mods;
		globals.trace = trace;
		globals.traceClear = traceClear;
		globals.traceError = traceError;

		if(!opts.noConflict) _.extend(global, globals);
		else trace("*noConflict* mode, use $$$.globals & $$$.globals.mods instead");

		require('./libs/extensions');

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
			setTimeout(() => {
				persistent = null;
			}, 1000);

		});

		loop();
	},

	builtInCommand() {
		return 'built-in';
	}
};

module.exports = $$$;