<template>
	
	<el-container>
		<el-header height="auto">
			<!-- <v-header></v-header> -->
			<home-header></home-header>
		</el-header>
		<el-main>
			<router-view/>
		</el-main>
	</el-container>
	
</template>
<script>
// import vHeader from './header.vue'
import HomeHeader from '@/components/commom/header.vue'

	export default {
		components:{
			HomeHeader
		}
	}
</script>
<style>
/*	.g-content{
		max-width: 600px;
	}*/
</style>