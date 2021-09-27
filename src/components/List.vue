<template>
	<el-container>
		<div id="form-outer">
			<el-card shadow="hover">
				<template #header>
					<div class="card-header">
						<span>帮助面板</span>
						<!-- <el-button class="button" type="text" @click="dialogVisible = true">使用说明</el-button> -->
					</div>

				</template>
				<el-collapse>
					<el-collapse-item title="工具包下载地址1" name="1">
						<el-link icon="el-icon-link" type="primary" :href="url" target="_blank">蓝奏云下载地址</el-link>
						<div>
							Time you enjoy wasting, is not wasted.
						</div>
						<div>
							The pessimist sees difficulty in every opportunity. The optimist sees the opportunity in
							every idfficulty.
						</div>
					</el-collapse-item>
					<el-collapse-item title="工具包下载地址2" name="2">
						<el-link icon="el-icon-paperclip" type="success" :href="url" target="_blank">备用下载地址</el-link>
						<div>
							But every ends marks a new begining.
						</div>
						<div>
							The supreme happiness of life is the conviction that we are loved.
						</div>
					</el-collapse-item>
					<el-collapse-item title="工具包下载地址3" name="3">
						<el-link icon="el-icon-key" type="warning" :href="url" target="_blank">备用下载地址</el-link>
						<div>
							When you have eliminated the impossible , whatever remains, however improbable, must be the
							truth.
						</div>
						<div>
							A man is not old as long as he is seeking something. A man is not old until regrets take the
							place of dreams.
						</div>
					</el-collapse-item>
					<el-collapse-item title="工具包下载地址4" name="4">
						<el-link icon="el-icon-sugar" type="danger" :href="url" target="_blank">备用下载地址</el-link>
						<div>
							Life is painting a picture, not doing a sum.
						</div>
						<div>
							The greatest test of courage on earth is to bear defeat without losing heart.
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
	import axios from 'axios'
	export default {
		data() {
			return {
				dialogVisible: false,
				url: 'https://wwr.lanzoui.com/iN0tRu4wxwb'
			}
		},
		created() {
			this.getUrL()
		},
		methods: {
			// 获取下载地址
			async getUrL() {
				const result = await axios.get(
					this.$url + "base/url");
				console.log(result)
				if (result.data.code == 200) {
					this.url = result.data.data.content
				} else {
					this.$message.error('下载地址获取失败');
				}
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
