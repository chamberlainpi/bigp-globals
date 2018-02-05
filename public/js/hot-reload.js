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
		case 'ts':
		case 'less':
		case 'scss':
		case 'sass': break;
		case 'css':
			$('link[hot-reload]').each((i, link) => {
				link.href = link.href.split('?')[0] + "?id=" + $$$.randID();
			});
			break;
		default:
			window.location.reload(true);
			break;
	}
});