<template>
	
	<div id="form-outer">
		<el-card shadow="hover">
			<template #header>
			    <div class="card-header">
			      <span>基础信息完善</span>
			      <el-button class="button" type="text" @click="dialogVisible = true">使用说明</el-button>
			    </div>
			  </template>
			<el-row>
				<el-col :span="12" :offset="5">
					<el-form ref="baseForm" :rules="rules" :model="form" label-position="right" label-width="140px">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						 <el-form-item label="性别" prop="sex">
						    <el-radio-group v-model="form.sex" type="sex">
						      <el-radio label="男"></el-radio>
						      <el-radio label="女"></el-radio>
						    </el-radio-group>
						  </el-form-item>
						<el-form-item label="年龄" prop="age">
							<el-input v-model.number="form.age"></el-input>
						</el-form-item>
						<el-form-item label="您是什么文化程度?" prop="culture">
							<el-select v-model="form.culture" placeholder="请选择您的文化程度">
							    <el-option
							      v-for="item in cultureList"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value"
							    >
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item label="您的婚姻状况如何?" prop="marriage">
							<el-select v-model="form.marriage" placeholder="请选择您的婚姻状况">
							    <el-option
							      v-for="item in marriageList"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value"
							    >
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item label="您和谁住在一起?" prop="live">
							<el-select v-model="form.live" placeholder="您和谁住在一起">
							    <el-option
							      v-for="item in liveList"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value"
							    >
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item label="您现在做什么工作?" prop="work">
							<el-select v-model="form.work" placeholder="您现在做什么工作">
							    <el-option
							      v-for="item in workList"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value"
							    >
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item>
						    <el-button type="primary" @click="onSubmit">开始问卷</el-button>
						    <el-button @click="onReset">重置</el-button>
						  </el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
	</div>
	
	<el-dialog
	  title="使用说明"
	  v-model="dialogVisible"
	  width="50%"
	>
	  
	  <div>在使用前请先按照如下步骤进行设置</div>
	  <div>1.建议使用谷歌浏览器</div>
	  <div>2.在谷歌浏览器地址栏输入</div>
	  <div>chrome://flags/#unsafely-treat-insecure-origin-as-secure</div>
	  <div>3.回车跳转到设置页面</div>
	  <div>
		  <img src="../assets/cz.png" width="600"/>
		  <!-- <el-image src="../assets/cz.png"></el-image> -->
	  </div>
	  <div>4.如图位置添加:http://81.69.223.15:7913/</div>
	  <div>5.重启浏览器完成设置</div>
	  <div>TIP:在使用中遇到其他问题,请联系计算机楼A513实验室</div>
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
				form: {
					name: '',
					age: '',
					sex: '',
					culture: '', // 文化程度
					marriage: '', // 婚姻状况
					live: '', // 生活情况
					work: '', // 工作情况
				},
				cultureList: [
					{
						value: '文盲',
						label: '文盲',
					},
					{
						value: '小学',
						label: '小学',
					},
					{
						value: '初中',
						label: '初中',
					},
					{
						value: '高中',
						label: '高中',
					},
					{
						value: '中专',
						label: '中专',
					},
					{
						value: '大专',
						label: '大专',
					},
					{
						value: '本科',
						label: '本科',
					},
					{
						value: '硕士',
						label: '硕士',
					},
					{
						value: '博士',
						label: '博士',
					},
				],
				marriageList: [
					{
						value: '未婚',
						label: '未婚',
					},
					{
						value: '已婚',
						label: '已婚',
					},
					{
						value: '离异',
						label: '离异',
					},
					{
						value: '再婚',
						label: '再婚',
					},
					{
						value: '同居',
						label: '同居',
					},
					{
						value: '丧偶',
						label: '丧偶',
					},
					{
						value: '其他',
						label: '其他',
					},
				],
				liveList: [
					{
						value: '父母',
						label: '父母',
					},
					{
						value: '配偶',
						label: '配偶',
					},
					{
						value: '孩子',
						label: '孩子',
					},
					{
						value: '同事',
						label: '同事',
					},
					{
						value: '同学',
						label: '同学',
					},
					{
						value: '亲戚',
						label: '亲戚',
					},
					{
						value: '独居',
						label: '独居',
					},
					{
						value: '其他',
						label: '其他',
					},	
				],
				workList: [
					{
						value: '农民',
						label: '农民',
					},
					{
						value: '工人',
						label: '工人',
					},
					{
						value: '专业技术人员、行政管理干部',
						label: '专业技术人员、行政管理干部',
					},
					{
						value: '个体户、临时工',
						label: '个体户、临时工',
					},
					{
						value: '无业',
						label: '无业',
					},
					{
						value: '学生',
						label: '学生',
					},
					{
						value: '家庭妇女',
						label: '家庭妇女',
					},
					{
						value: '其他',
						label: '其他',
					},		
				],
				dialogVisible: false,
				baseId: null,
				rules: {
					name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
					sex: [{ required: true, message: '请选择性别', trigger: 'change' },],
					culture: [{ required: true, message: '请选择一项内容', trigger: 'change' },],
					live: [{ required: true, message: '请选择一项内容', trigger: 'change' },],
					work: [{ required: true, message: '请选择一项内容', trigger: 'change' },],
					marriage: [{ required: true, message: '请选择一项内容', trigger: 'change' },],
					age: [ { required: true, message: '年龄不能为空'},
					       { type: 'number', message: '年龄必须为数字值'},],
				}
			}
		},
		methods:{
			// 提交基础信息
			async onSubmit() {
			   this.$refs['baseForm'].validate((valid) => {
				  if (valid) {
					this.init()
				  } else {
					this.$message.error('表单验证失败');
					return false
				  }
				})
			},
			async init() {
				const result = await axios.post(
				        this.$url + "base/init",
				        this.form
				 );
				 console.log(result)
				 if(result.data.code == 200) {
					this.baseId = result.data.data
					// 跳转
					this.$router.push({
						path:"main",
						query:{
							baseId: this.baseId
						}
					})
				 }else{
					 this.$message.error('提交失败,请重试');
				 }
			},
			onReset() {
				this.$refs['baseForm'].resetFields()
				// let that = this
				// that.form.name = ''
				// that.form.sex = ''
				// that.form.age = ''
				// that.form.culture = ''
				// that.form.work = ''
				// that.form.live = ''
				// that.form.marriage = ''
				this.$message.success('重置成功');
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
