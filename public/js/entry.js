/**
 * Created by Chamberlain on 2/6/2018.
 */

$$$.io = io();

require('../../libs/extensions');
require('./vendor/hot-reload');

import VueTools from './vendor/vue-tools';
import VueComponents from './vue-components';
import Hello from './routes/hello';

$$$.showdown = new showdown.Converter({
	omitExtraWLInCodeBlocks: true,
	smartIndentationFix: true,
	simpleLineBreaks: true,
	emoji: true,
});

$(document).ready(() => {
	const READY = {
		Vue: Vue,
		VueTools: VueTools,
		VueComponents: VueComponents,
		VueRouter: VueRouter,

		default() {
			//Initialize Vue (components, router and vue instance):
			VueTools.init(VueComponents, {
				'/': {name: 'Hello', component: Hello}
			});

			this.applyShowdown();
		},

		applyShowdown() {
			$('.md').each((i, md) => {
				const contents = $(md).contents();
				contents.each((i, text) => {
					let txt = (text.innerHTML || '').trim();
					if(txt.length===0) return;

					if(!md.classList.contains('md-pre')) {
						let txtSplit = txt.split('\n');
						txtSplit = txtSplit.map(line => line.trim());
						txt = txtSplit.join('\n');
					}

					text.innerHTML = $$$.showdown.makeHtml( txt );
				});
			})
		}
	};

	if(window.init) {
		init(READY);
	} else {
		READY.default();
	}
});