/**
 * Created by Chamberlain on 2/3/2018.
 */
setInterval(function checkConnection() {
	$$$.io.emit('check', true);
}, 500);

$$$.io.on('already-opened', () => {
	TweenMax.fromTo(document.body, 0.5, {alpha:0}, {alpha:1});

	Push.create("WebApp Already Opened!", {
		body: "Click here to open it.",
		icon: '/images/icon-exclamation.png',
		timeout: 5000,
		onClick: function () {
			window.focus();
			this.close();
		}
	});
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