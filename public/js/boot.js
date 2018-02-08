/**
 * Created by Chamberlain on 2/6/2018.
 */

$$$.io = io();
$$$.showdown = new showdown.Converter({
	omitExtraWLInCodeBlocks: true,
	smartIndentationFix: true,
	simpleLineBreaks: true,
	emoji: true,
});

import '../../libs/extensions';
import HotReload from './vendor/hot-reload';
import VueTools from './vendor/vue-tools';

HotReload();

const DefaultComponents = {
	'btn': {
		props: ['icon', 'bgcolor', 'href'],
		data() {
			return {
				'bgcolor': '#0f8'
			}
		},
		methods: {
			click(e) {
				if(this.href) {
					return window.location.href = this.href;
				}
				this.$emit('click', e);
			}
		},
		template:
			`<div :style="{background: bgcolor}" :class="'v-middle md-no ' + icon" @click="click">
				<i :class="'fa fa-'+icon"></i><slot></slot>
			</div>`
	},

	'spinner': {
		props: ['size'],
		data() {
			return {
				size: 1
			}
		},

		computed: {
			scaleSize() {
				return `scale(${this.size})`;
			}
		},

		methods: {
			show(speed=0.8) {
				const el = this.$el;
				$(el).show();

				TweenMax.killTweensOf(el);
				TweenMax.to(el, speed, {rotation: '+=360', repeat:-1, ease: Linear.easeNone});
			}
		},

		template:
			`<div>
				<img src="images/spinner.png" :style="{ transform: scaleSize }">
			</div>`
	}
};


const DefaultRoutes = {
	'/': {
		name: 'Home',
		component: {
			template: `<div>Home Page.</div>`
		}
	}
};

const DefaultMethods = {
	methods: {
		copyTemplate() {
			$$$.io.emit('copy-template');
			$$$.vueOf('#main-spinner').show();
			TweenMax.to($$$.app, 0.3, {alpha:0.5});
		}
	}
};

$$$.vueOf = function(el) {
	if(_.isString(el)) el = $(el);
	if(el instanceof jQuery) el = el[0];
	return el.__vue__;
};

$(document).ready(() => {
	const READY = {
		Vue: Vue,
		VueTools: VueTools,
		VueAppTemplate: DefaultComponents,
		VueRouter: VueRouter,

		default(components, routes, methods) {
			//Initialize Vue (components, router and vue instance):
			VueTools.init(
				_.extend(DefaultComponents, components),
				_.extend(DefaultRoutes, routes),
				_.extend(DefaultMethods, methods)
			);

			this.applyShowdown();
		},

		applyShowdown() {
			function hasNoMarkdown() {
				return _.toArray(arguments).find(el => el.classList.contains('md-no'));
			};

			$('.md').each((i, md) => {
				const contents = $(md).contents();

				if(contents.length===1 && !contents[0].innerHTML) {
					replaceMD(0, md);
				} else {
					contents.each(replaceMD);
				}

				function replaceMD(i, text) {
					let txt = (text.innerHTML || '').trim();
					if(txt.length===0 || hasNoMarkdown(md, text)) return;

					if(!md.classList.contains('md-pre')) {
						let txtSplit = txt.split('\n');
						txtSplit = txtSplit.map(line => line.trim());
						txt = txtSplit.join('\n');
					}

					text.innerHTML = $$$.showdown.makeHtml( txt );
				}
			})
		}
	};

	window.init ? init(READY) : READY.default();
});

require('./entry');