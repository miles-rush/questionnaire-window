<template>
	<div id="form-outer">
		<el-card shadow="hover" class="box-card">
			<template #header shadow="hover">
				<div class="card-header">
					<span>问卷系统</span>
					<el-button class="button" type="text" @click="baseInfoShow = true">信息查看</el-button>
				</div>
			</template>
			<el-row v-if="render">
				<el-col :span="24" :offset="3" id="area">
					<el-row>
						<el-col :span="6">
							<video playsinline src class="myCamera" id="myCamera" ref="myCamera"></video>
						</el-col>
						<!-- <el-col :span="6" :offset="6">
						<el-descriptions border column="1" title="用户信息" size="medium" style="margin-top: 5px;">
						  <el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
						  <el-descriptions-item label="性别">{{ user.sex }}</el-descriptions-item>
						  <el-descriptions-item label="年龄">{{ user.age }}</el-descriptions-item>
						</el-descriptions>
						</el-col>-->
					</el-row>
				</el-col>

				<el-col :span="24" :offset="0" v-if="isStart" style="margin-top: 20px;box-shadow: #42B983;">
					<div style="text-align: center;">
						<!-- <el-input
					  type="textarea"
					  size="medium"
					  
					  :autosize="{ minRows: 2, maxRows: 4}"
					  v-model="nowQt"
					  disabled=""
					>
						</el-input>-->
						<text id="question"
							style="height: 100px;width: 450px;">{{ nowQt.no }}.{{ nowQt.content }}</text>
						<!-- <textarea disabled="disabled" readonly id="question" style="height: 100px;width: 450px;">{{ qList[nowq] }}</textarea> -->
					</div>
				</el-col>

				<el-col :span="12" :offset="9">
					<el-button v-if="!isStart" type="primary" round @click="start"
						style="margin-top: 40px;margin-left: 45px;">开 始 问 卷</el-button>
					<el-button v-if="isStart" type="success" round style="margin-top: 40px;margin-right: 80px;"
						@click="yes()" :disabled="submiting">是</el-button>
					<el-button v-if="isStart" type="danger" round style="margin-top: 40px;" @click="no()"
						:disabled="submiting">否</el-button>
				</el-col>

				<el-row>
					<el-col :offset="14" style="margin-top: 20px;">
						<div>
							<el-divider>注意事项</el-divider>
							<span>1.全程请保持脸部正对摄像头</span>
							<el-divider></el-divider>
							<span>2.每道题目只有一次选择机会</span>
							<el-divider></el-divider>
							<span>3.完成所有问卷内容后自动提交，请不要立马关闭浏览器</span>
							<el-divider>出现报错请联系管理员</el-divider>
						</div>
					</el-col>
				</el-row>
			</el-row>
		</el-card>
	</div>

	<el-dialog title="数据上传中" v-model="dialogVisible" width="40%" center>
		<span>
			<el-icon class="is-loading">
				<loading />
			</el-icon>请不要立马关闭浏览器,等待数据上载和下载,确认数据保存后关闭。
		</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="个人信息" v-model="baseInfoShow" width="30%" center>
		<el-descriptions border column="1" title size="medium" style="margin-top: 5px;">
			<el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
			<el-descriptions-item label="性别">{{ user.sex }}</el-descriptions-item>
			<el-descriptions-item label="年龄">{{ user.age }}</el-descriptions-item>
		</el-descriptions>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="baseInfoShow = false">取 消</el-button>
				<el-button type="primary" @click="baseInfoShow = false">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import axios from 'axios'
	import RecordRTC from 'recordrtc';
	const fs = require('fs')
	const { dialog } = require('electron')
	export default {
		data() {
			return {
				video: null,
				recorder: null,
				// 是否开始录制
				isStart: false,
				height: null,
				render: true,
				// 当前题目下标
				nowq: 0,
				nowQt: null,
				// 题目数组
				qList: [],
				// 最后题目的编号
				qMax: 0,
				// 存放结果的数组
				resultList: [],
				// 存放时间的数组
				timeList: [],
				// 存放题号的数组
				itemList: [],
				baseId: null,
				user: {
					name: null,
					age: null,
					sex: null,

				},
				// 提交的信息
				form: {
					baseId: null,
					results: null,
					times: null,
					videoName: null,
					nos: null,
				},
				submiting: false,
				dialogVisible: false,
				localStream: null,
				baseInfoShow: false,
				// 当前问卷类别
				nowType: '',
				// 当前问卷是否要显示详细
				turn: false
			}
		},
		created() {
			this.baseId = this.$route.query.baseId
			this.init()
		},
		mounted() {
			let that = this
			let constraints = {
				audio: true,
				video: {
					// width: 1280, height: 720 
					// width: this.CurrentWidth / 2,
					// height: this.CurrentHeight / 2,
					frameRate: {
						ideal: 60,
						max: 60,
						min: 30
					}
					// width: { min: 1024, ideal: 1280, max: 1920 },
					// height: { min: 776, ideal: 720, max: 1080 }
				}
			}

			navigator.mediaDevices.getUserMedia(constraints)
				.then(mediaStream => {
					console.log('开启摄像头')
					this.video = this.$refs.myCamera
					this.video.srcObject = mediaStream
					// 视频参数设置
					let options = {
						mimeType: 'video/webm',
						video: {
							width: 1920,
							height: 1080
						},
						// bitsPerSecond: 51200000,
						frameRate: 60
					};
					this.recorder = RecordRTC(mediaStream, options)
					this.video.onloadedmetadata = e => {
						this.video.play()

					}

					this.localStream = mediaStream
					that.$message.success('摄像头开启成功');
					// this.recorder.startRecording()

				})
			// .catch(function(err){
			// 	that.$message.error('摄像头开启失败')
			// })
		},
		methods: {
			// 从服务器加载题目
			async init() {
				const result = await axios.get(this.$url + 'base/survey/all')
				console.log(result)
				if (result.data.code == 200) {
					this.qList = result.data.data
					// 问卷显示部分初始化
					this.nowQt = this.qList[0]
					// qmax是最后一道题的no
					this.qMax = this.qList[this.qList.length - 1].no
					this.nowType = this.nowQt.type
					console.log(this.qList)
					// 加载用户信息
					const userResult = await axios.get(this.$url + 'base/get/' + this.baseId)
					console.log(userResult)
					if (userResult.data.code == 200) {
						this.user.name = userResult.data.data.name
						this.user.sex = userResult.data.data.sex
						this.user.age = userResult.data.data.age

					} else {
						this.$message.error('用户信息加载失败');
					}
				} else {
					this.$message.error('问卷内容下载失败');
				}

			},
			start() {

				//document.getElementById('myCamera').style.height = '50%'
				// document.getElementById('area').style.height = '50%'

				this.recorder.startRecording()
				this.isStart = true
				// document.getElementById('question').style.marginBottom = '' + this.height +'px'
				this.$message.success('开始问卷内容');
				// 记录开始时间
				let time = Date.now()
				this.timeList.push(time)
			},
			yes() {
				this.next(1)
			},
			no() {
				this.next(0)
			},
			next(result) {
				// 最后一题的判定
				if (this.nowQt.no == this.qMax) {
					this.finsih()
					return
				}
				// 主逻辑
				if (this.nowType == '') {
					// 还未开始
					this.nowType = this.nowQt.type
				} else if (this.nowType != this.nowQt.type) {
					// 问卷更换1
					this.nowType = this.nowQt.type // 更新问卷类别
					this.turn = false // 重置turn判断
				}

				// result = 1 加载更多题目 判断
				if (result == 1 && this.nowQt.turn == 0) {
					this.turn = true
				}


				// 记录答案
				this.resultList.push(result)
				// 记录时间
				let time = Date.now()
				this.timeList.push(time)
				// 记录题号
				this.itemList.push(this.nowQt.id)

				// 下一题题号的确定
				do {
					// 判断是不是已经最后一道了
					// 结束
					if (this.nowQt.no == this.qMax) {
						this.finsih()
						break

					}

					this.nowq = this.nowq + 1 // 题号下标
					this.nowQt = this.qList[this.nowq] // 更新题目内容
					// 问卷更换2 跳过的时候会切换到下一个问卷
					if (this.nowType != this.nowQt.type) {
						// 全部跳过了
						this.nowType = this.nowQt.type
						this.turn = false
					}

					//跳过下一道题目的逻辑
					// 标识turn = 1 this.turn为假:前面所有的题目都选了否 属于同一问卷
				} while (this.nowQt.turn == 1 && this.turn == false && this.nowType == this.nowQt.type)


				console.log('resultList:', this.resultList)
				console.log('timeList:', this.timeList)
				console.log('itemsList', this.itemList)
			},
			finsih() {
				// 做完了
				this.$message.warning('最后一题');
				// 提交数据
				// 禁用按钮
				this.submiting = true
				this.dialogVisible = true
				// 关闭摄像头
				this.video.pause()
				this.localStream.getTracks().forEach((track) => {
					track.stop();
				});
				this.submit()
				return
			},
			async submit() {
				let results = this.resultList.join('-')
				let times = this.timeList.join('-')
				let items = this.itemList.join('-')
				this.form.baseId = this.baseId
				this.form.results = results
				this.form.times = times
				this.form.nos = items
				this.form.videoName = new Date().getTime()

				let fileName = null


				this.recorder.stopRecording(() => {
					// console.log(this.video.src)
					const blob = this.recorder.getBlob()
					let fr = new FileReader()
					fr.onload = _ => {
						this.showSaveDialog(fr.result)
					}
					fr.readAsArrayBuffer(blob)


					// const downloadLink = document.createElement('a')
					// downloadLink.href = URL.createObjectURL(this.recorder.getBlob())
					// // 下面是定义文件名字
					// // fileName = new Date().getTime() + ''
					// downloadLink.download = `${this.form.videoName}`
					// // 点击a标签
					// downloadLink.click()
				})


				const result = await axios.post(this.$url + 'base/submit', this.form)
				if (result.data.code == 200) {
					this.$message.success('提交成功');
				}
			},
			showSaveDialog(arrayBuffer) {
				let path = 'D:\\data\\1.webm'
				let buffer = new Buffer(arrayBuffer);
				let dt = new Date();
				fs.writeFile(path, buffer, function(err) {
					if (err) {
						alert("An error ocurred creating the file " + err.message);
					}
				});
				// dialog.showSaveDialog({
				// 	filters: [{
				// 		name: `webm file`,
				// 		extensions: ['webm']
				// 	}]
				// }, fileName => {
				// 	if (fileName) {
				// 		fs.writeFile(fileName, buffer, function(err) {
				// 			if (err) {
				// 				alert("An error ocurred creating the file " + err.message);
				// 			}
				// 		});
				// 	}
				// });

			},
			close() {
				this.recorder.stopRecording(() => {
					console.log(this.video.src)
					const downloadLink = document.createElement('a')
					downloadLink.href = URL.createObjectURL(this.recorder.getBlob())
					// 下面是定义文件名字
					downloadLink.download = `${new Date().getTime()}`
					// 点击a标签
					downloadLink.click()
				})

			},
		}
	}
</script>

<style>
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

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

	#question {
		box-shadow: 0 2px 1px 4px rgba(0, 170, 255, 0.1),
			0 0 6px rgba(0, 0, 0, 0.04);
		box-sizing: border-box;
		font-size: 1.1rem;
		font-weight: 1000;
	}
</style>
