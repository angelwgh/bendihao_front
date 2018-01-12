<template>
	<div class="g-home-side-bar">
		<div class="head-img img-circle">
			<img :src="headImg">
		</div>
	</div>
	
</template>
<script>
import headImg from '@/assets/images/head-image.jpg'
	export default{
// src/assets/images/head-image.jpg
	
		data () {
			return {
				headImg: headImg
			}
		}
		
	}
</script>

<style>
	.g-home-side-bar .head-img{
		margin: 0 auto;
		padding: 50px;
		overflow: hidden;
		width: 0;
		height: 0;
		
	}

	.g-home-side-bar .head-img img{
		width: 200px;
		transform: translate(-50%,-50%);
	}
</style>