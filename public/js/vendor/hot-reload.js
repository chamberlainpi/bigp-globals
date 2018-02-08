export default function() {
	setInterval(checkConnection, 500);

	function checkConnection() {
		$$$.io.emit('check', true);
	}


	function flashEverything() {
		TweenMax.fromTo(document.body, 0.5, {alpha:0}, {alpha:1});
	}

	$$$.io.on('already-opened', () => {
		flashEverything();

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
		const ext = (path || '').split('.').pop().toLowerCase();

		switch(ext) {
			case 'ts':
			case 'less':
			case 'scss':
			case 'sass': break;
			case 'css':
				$('link[hot-reload]').each((i, link) => {
					link.href = link.href.split('?')[0] + "?id=" + $$$.randID();
				});

				flashEverything();
				break;
			default:
				window.location.reload(true);
				break;
		}
	});
}