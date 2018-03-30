/**
 * Created by Chamberlain on 2/8/2018.
 */
export default {
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