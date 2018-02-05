/**
 * Created by Chamberlain on 2/3/2018.
 */
var $$$ = $$$ || {};

$(document).ready(init);

$$$.io = io();

$$$.showdown = new showdown.Converter({
	omitExtraWLInCodeBlocks: true,
	smartIndentationFix: true,
	simpleLineBreaks: true,
	emoji: true,
});

$$$.copyProjectTemplate = function(which) {
	$$$.io.emit('copy-project-template', which);
};

function init() {
	trace("We're ready here!");

	$('.md').each((i, md) => {
		var contents = $(md).contents();
		contents.each((i, text) => {
			var txt = (text.innerHTML || '').trim();
			if(txt.length===0) return;

			if(!md.classList.contains('md-pre')) {
				var txtSplit = txt.split('\n');
				txtSplit = txtSplit.map(line => line.trim());
				txt = txtSplit.join('\n');
			}

			text.innerHTML = $$$.showdown.makeHtml( txt );
			trace(text.innerHTML);
		});
	})
}