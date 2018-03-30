/**
 * Created by Chamberlain on 2/8/2018.
 */
export default {
    methods: {
        copyTemplate() {
            $$$.io.emit('copy-template');
            $$$.vueOf('#main-spinner').show();
            TweenMax.to($$$.app, 0.3, {alpha:0.5});
        }
    }
};