<template>
	<div class="g-login">
		<div class="m-login">
			<div class="title">用户注册</div>
			<el-form ref="userInfo" 
				:model="userInfo" 
				:rules="rules"
				status-icon
				label-width="80px">
				<el-form-item label="用户名" prop="username">
				    <el-input 
				    	v-model="userInfo.username"
				    	placeholder="输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password1">
				    <el-input 
				    	type="password"
				    	v-model="userInfo.password1"
				    	placeholder="输入密码"></el-input>
				</el-form-item>
				<el-form-item label="重复密码" prop="password2">
				    <el-input 
				    	type="password"
				    	v-model="userInfo.password2"
				    	placeholder="再次输入密码"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" >登录</el-button>
				    <el-button type="primary" @click="signup">注册</el-button>
				</el-form-item>
			</el-form>
		</div>
		
	</div>
</template>
<script>
	import md5 from 'md5';

	export default {
		data () {
			return {
				userInfo:{
					username:'',
					password1:'',
					password2:''
				},
				rules:{
					username:[
						{validator:this.validateUsername, trigger: 'change'}
					],
					password1:[
						{validator:this.validatePassword1, trigger: 'change'}
					],
					password2:[
						{validator:this.validatePassword2, trigger: 'change'}
					]
				},
				timer:null
			}
		},
		methods: {
			validateUsername (rule, value, callback) {
				// var timer = null;
				var reg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){2,15}$/
				if (!value) {
		          return callback(new Error('请输入用户名'));
		        }

		        if(reg.test(value) === false){
		        	return callback(new Error('用户名长度在2-15格字符,只能包含汉字、字母、数字以及下划线'));
		        }

		        clearTimeout(this.timer);
		        this.timer=setTimeout(()=>{
		        	this.checkUsername((ret) => {
			        	console.log(ret)
			        	if(ret.data.state === 0){
			        		callback(new Error(ret.data.msg))
			        	}else {
			        		callback()
			        	}
			        })
		        },500)
		        
		        
			},
			validatePassword1 (rule, value, callback) {
				var reg = /.{6,15}/
				if(!value) {
					return callback(new Error('请输入密码'));
				}else{
					if(reg.test(value) === false){
						return callback(new Error('密码长度在6-15位之间'));
					}
					// 如果password2不为空, 则校验password2
					if (this.userInfo.password2 !== '') {
			            this.$refs.userInfo.validateField('password2');
			          }
			        callback()
				}
			},

			validatePassword2 (rule, value, callback) {
				if(!value) {
					return callback(new Error('请再次输入密码'));
				}else{
					if(value !== this.userInfo.password1){
						return callback(new Error('两次密码输入不一致'));
					}
					callback()
				}
			},

			checkUsername (cb) {
				this.$axios({
					url:'/ajax/userController/checkUsername',
					params:{
						username: this.userInfo.username
					}
				})
				.then((ret)=> {
					cb(ret)
				})
			},

			signup () {
				this.$axios({
					url:'/ajax/userController/signup',
					method: 'post',
					data: {
						username: this.userInfo.username,
						password: this.userInfo.password1
					}
				})
				.then((ret)=>{
					console.log(ret)
					if(ret.status == 200 && ret.data.state == 1){
						this.$router.push('login')
					}
				})
			}
		}

	}
</script>
<style>
	.m-login{
		position: fixed;
		padding: 10px;
		padding-right: 30px;
		top: 50%;
		left: 50%;
		width: 500px;
		transform: translate(-50%, -50%);
		border-radius: 5px;
		border:1px solid #606266;
	}
	.m-login .title{
		color: #606266;
		text-align: center;
		line-height: 50px;
		font-size: 25px;
	}

</style>