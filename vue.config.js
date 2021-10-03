const webpack = require('webpack')
// const nodeExternals = require('webpack-node-externals');

module.exports = {
	// 避免Eslint报错
	lintOnSave: false,
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				"appId": "com.survey.app",
				"productName": "问卷系统",
				"copyright": "Copyright KRG © 2021", //版权信息
				// "win":{
				// 	"icon": "./icon.png"
				// },
			},
			nodeIntegration: true,
			// externals: ['@ffmpeg-installer']
		}
	},
	// 解决ffmepg导入的问题
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				'process.env.FLUENTFFMPEG_COV': false
			})
		]
	},
	// externals: [
	// 	nodeExternals(),
	// 	{ '@ffmpeg-installer/ffmpeg': { commonjs: '@ffmpeg-installer/ffmpeg' } },
	// 	{ 'fluent-ffmpeg': { commonjs: 'fluent-ffmpeg' } },
	// ],

}