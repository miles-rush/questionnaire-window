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
						<div>
							开始一份新的问卷。
						</div>
						<div>
							将会打开新窗口进行问卷内容,请勿关闭当前窗口。
						</div>
					</el-collapse-item>
					<el-collapse-item title="系统配置" name="2">
						<el-link icon="el-icon-paperclip" type="success">视频保存路径设置</el-link>
						<div>
							在这里进行系统参数的配置.
						</div>
						<div>
							在使用软件之前,请进行一次初始化配置.
						</div>
					</el-collapse-item>
			
				</el-collapse>
			</el-card>
		</div>
		<el-footer>
			<el-row>
				<el-col :offset="10"><span v-on:dblclick="dialogVisible = true">Created by KRG ©2021</span></el-col>
			</el-row>
		</el-footer>

	</el-container>
	<el-dialog title="开发信息" v-model="dialogVisible" width="50%">
		<div style="text-align: center;align-items: center;">
			<div>
				<!-- <img src="../assets/cz.png" width="600"/> -->
				<el-image style="width: 150px;"
					src="https://cdn.jsdelivr.net/gh/miles-rush/yoi/2021/img/cover.jpg">
				</el-image>
			</div>
			<div>KingRainGrey、</div>
			<div>~</div>
			<div>
				<el-link type="primary" href="https://mirrormoon.top/#/" target="_blank">个人主页</el-link>
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

			newSurvey() {
				ipcRenderer.send("base", "xxxxxxxxxxxxxxx")
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
		font-family: 'Raleway', Helvetica, sans-serif;
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





