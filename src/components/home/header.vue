<template>
	<div class="m-header">
		<h1>angelwgh'blog</h1>
		<div class="top-bar">
			<el-button plain size="mini">注册</el-button>
			<el-button plain size="mini">登录</el-button>
		</div>
	</div>
</template>
<script>
	export default {

	}
</script>
<style>
	.m-header{
		height: 60px;
		line-height: 60px;
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