<template>
	<div class="g-singup">
		<div class="m-singup">
			<div class="title">用户登录</div>
			<el-form ref="userInfo" 
				:model="userInfo" 
				:rules="rules"
				label-width="80px">
				<el-form-item label="用户名" prop="username">
				    <el-input 
				    	v-model="userInfo.username"
				    	placeholder="输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
				    <el-input 
				    	type="password"
				    	v-model="userInfo.password"
				    	placeholder="输入密码"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="login">登录</el-button>
				    <el-button type="primary" @click="signup">注册</el-button>
				</el-form-item>
			</el-form>
		</div>
		
	</div>
</template>
<script>
	export default {
		data () {
			return {
				userInfo: {
					username:'',
					password:''
				},
				rules: {
					username:[
						{ required: true, message: '请输入用户名', trigger: 'blur'}
					],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur'},
						{ min: 6, max: 18, message: '密码长度在6-18位之间', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			login() {
				console.log(this.username)
				this.$axios({
					url:'/ajax/userController/login',
					params: {
						username: this.userInfo.username,
						password: this.userInfo.password
					}
				}).then((ret)=>{
					if(ret.status == 200 && ret.data.state == 1){
						this.$router.push({name:'home'})
					}
				})
			},

			// queryUserInfo() {
			// 	this.$axios({
			// 		url:'/ajax/userController/queryUserInfo'
			// 	})
			// 	.then( (ret)=> {
			// 		console.log(ret)
			// 	})
			// }
			signup () {
				this.$router.push('signup')
			}
		}
	}
</script>
<style>
	.m-singup{
		position: fixed;
		padding: 10px;
		padding-right: 30px;
		top: 50%;
		left: 50%;
		width: 350px;
		transform: translate(-50%, -50%);
		border-radius: 5px;
		border:1px solid #606266;
	}
	.m-singup .title{
		color: #606266;
		text-align: center;
		line-height: 50px;
		font-size: 25px;
	}

</style>