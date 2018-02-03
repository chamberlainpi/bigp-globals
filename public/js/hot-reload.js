/**
 * Created by Chamberlain on 2/3/2018.
 */
setInterval(function checkConnection() {
	$$$.io.emit('check', true);
}, 500);

$$$.io.on('already-opened', () => {
	TweenMax.fromTo(document.body, 0.5, {alpha:0}, {alpha:1});
});

$$$.io.on('file-changed', path => {
	var ext = path.split('.').pop().toLowerCase();

	switch(ext) {
		case 'css':
			break;
		default:
			window.location.reload(true);
			break;
	}
});