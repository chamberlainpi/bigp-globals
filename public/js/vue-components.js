/**
 * Created by Chamberlain on 2/6/2018.
 */
export default {
	'app': {
		template: `
			<div class="header">
				<h1>Welcome to the WebApp Setup!</h1>
			</div>
			<div class="page md">
				<span>
				To get started, place an ***index.html*** file in your \`/public/\` directory.
			
				**Or**, press this button to copy a template to your project.
				</span>
				<input type="button" onclick="$$$.copyProjectTemplate()" value="Copy Project Template"/>
				<router-view></router-view>
			</div>` //
	},
};