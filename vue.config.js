module.exports = {
	// 避免Eslint报错
	lintOnSave: false,
	pluginOptions: {
		electronBuilder: {
			builderOptions:{
				"appId": "com.survey.app",
				"productName": "问卷系统",
				"copyright": "Copyright KRG © 2021",//版权信息
				// "win":{
				// 	"icon": "./icon.png"
				// },
			},
			nodeIntegration: true
		}
	}
}
