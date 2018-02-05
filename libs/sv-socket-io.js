/**
 * Created by Chamberlain on 2/3/2018.
 */
const socketIO = require('socket.io');
const sockets = [];
const handlers = [];

const SELF = module.exports = {
	init($$$) {
		const io = $$$.io = socketIO($$$.http);

		io.on('connection', socket => {
			sockets.push(socket);

			trace("Connected: ".yellow + socket.id);

			SELF.applyHandlers(socket);

			socket.on('disconnect', () => {
				sockets.remove(socket);

				trace("Disconnected: ".red + socket.id);
			});
		});
	},

	addEvent(event, cb) {
		handlers.push({event:event, cb:cb});

		sockets.forEach(socket => {
			socket.on(event, cb);
		});
	},

	applyHandlers(socket) {
		handlers.forEach(hd => {
			socket.on(hd.event, hd.cb);
		});
	}
};