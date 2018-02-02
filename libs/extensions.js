/**
 * Created by Chamberlain on 2/2/2018.
 */

_.extend(String.prototype, {
	fixSlash() {
		return this.replace(/\\/g, '/');
	},
	has(key) {
		return this.indexOf(key) > -1;
	}
});
