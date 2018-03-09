<template>
		
		<div class="m-header">
			<v-nav></v-nav>	
			<h1>angelwgh'blog</h1>
			<div class="top-bar">
				<el-button plain size="mini" @click="creatNote">写日志</el-button>
				<el-button plain size="mini" @click="signup">注册</el-button>
				<el-button plain size="mini" @click="login">登录</el-button>
			</div>
		</div>
	
</template>
<script>

	import vNav from './home-top-nav.vue'
	export default {
		components:{
			vNav
		},
		methods: {
			creatNote () {
				this.$router.push('creatNote')
			},
			login () {
				this.$router.push('login')
			},
			signup () {
				this.$router.push('signup')
			}
		}
	}
</script>
<style>
	.m-header{
/*		height: 60px;
		line-height: 60px;*/
		font-size: 30px;
		text-align: center;
		border-top: 2px solid #000;
		position: relative;
	}

	.top-bar{
		position: absolute;
		top: 0;
		right: 20px;
		line-height: 20px;
	}
</style>