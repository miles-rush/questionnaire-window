
<template>
	<el-container>
		<div id="form-outer">
			<el-card shadow="hover">
				<template #header>
					<div class="card-header">
						<span>Hello~欢迎来到问卷系统</span>
						<!-- <el-button class="button" type="text" @click="dialogVisible = true">使用说明</el-button> -->
					</div>
				</template>
				<el-collapse>
					<el-collapse-item title="开始新问卷" name="1">
						<el-link icon="el-icon-link" type="primary" @click="newSurvey()">点此开始</el-link>
						<div>开始一份新的问卷。</div>
						<div>将会打开新窗口进行问卷内容,请勿关闭当前窗口。</div>
					</el-collapse-item>
					<el-collapse-item title="系统配置" name="2">
						<el-link icon="el-icon-paperclip" type="success" @click="showConfig()">视频保存路径设置</el-link>
						<div>在这里进行系统参数的配置.</div>
						<div>在使用软件之前,请进行一次初始化配置.</div>
					</el-collapse-item>
					<el-collapse-item title="视频处理" name="3">
						<el-link icon="el-icon-paperclip" type="warning" @click="showSplite()">视频处理</el-link>
						<div>在这里进行后期内容的处理.</div>
						<div>对保存的视频进行分割等.</div>
					</el-collapse-item>
					<el-collapse-item title="数据分析" name="4">
						<el-link icon="el-icon-paperclip" type="info" @click="showAnalyze()">数据分析</el-link>
						<div>数据分析模块.</div>
						<div>待开发.</div>
					</el-collapse-item>
				</el-collapse>
			</el-card>
		</div>
		<el-footer>
			<el-row>
				<el-col :offset="10">
					<span v-on:dblclick="dialogVisible = true">Created by KRG ©2021</span>
				</el-col>
			</el-row>
		</el-footer>
	</el-container>
	<el-dialog title="开发者" v-model="dialogVisible" width="50%">
		<div style="text-align: center;align-items: center;">
			<div>
				<!-- <img src="../assets/cz.png" width="600"/> -->
				<el-image
					style="width: 150px;"
					src="https://cdn.jsdelivr.net/gh/miles-rush/yoi/2021/img/cover.jpg"
				></el-image>
			</div>
			<div>KingRainGrey、</div>
			<div>蝉鸣如雨 花宵道中</div>
			<div>
				<el-link type="primary" @click="openMy()">个人主页</el-link>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
const Store = require('electron-store')
const store = new Store()
import { ipcRenderer } from "electron";
export default {
	data() {
		return {
			dialogVisible: false,
		}
	},
	created() {

	},
	methods: {
		// 在开始问卷前判断一下路径是否配置
		newSurvey() {
			let path = store.get('saveFilePath')
			// console.log(path)
			if (path) {
				ipcRenderer.send("base")
			} else {
				this.$message.error("请先配置视频保存路径")
			}

		},
		showConfig() {
			ipcRenderer.send("config")
		},
		showSplite() {
			let path = store.get('spliteFilePath')
			let ffmepgPath = store.get('ffmepgPath')
			
			if (path && ffmepgPath) {
				ipcRenderer.send("splite")
			} else {
				this.$message.error("请先配置视频分割路径和ffmpeg路径")
			}
		},
		showAnalyze() {
			ipcRenderer.send("chart")
		},
		openMy() {
			ipcRenderer.send("open-url", 'https://mirrormoon.top/#/')
		}
	}
}
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Raleway:400,500);

html,
body {
	background-color: #a9d7d1;
	/* text-align: center; */
	font-family: "Raleway", Helvetica, sans-serif;
	min-width: 320px;
}

#form-outer {
	/* background-color: rgb(250, 250, 250); */
	margin: 0 auto;
	border-radius: 4px;
	width: 75%;
	max-width: 900px;
	padding: 10px;
	padding-top: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.text {
	font-size: 14px;
}
</style>





