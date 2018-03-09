<template>
	
	<el-container>
		<el-header height="auto">
			<!-- <v-header></v-header> -->
			<home-header></home-header>
		</el-header>
		<el-main>
			<router-view/>
		</el-main>
		<!-- <div class="container">
			<el-container>
				<el-aside>
					<home-side-bar></home-side-bar>
				</el-aside>
				<el-main><router-view/></el-main>
			</el-container>
		</div>
		
		<el-footer></el-footer> -->
	</el-container>
	
</template>
<script>
// import vHeader from './header.vue'
import {HomeHeader} from '@/components/header'
import {HomeSideBar} from '@/components/sideBar'
	export default {
		components:{
			HomeHeader, HomeSideBar
		}
	}
</script>
<style>
/*	.g-content{
		max-width: 600px;
	}*/
</style>