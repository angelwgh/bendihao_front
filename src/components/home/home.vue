<template>
	
	<el-container>
		<el-header>
			<v-header></v-header>
		</el-header>
		<el-container>
			<el-aside>侧边</el-aside>
			<el-main><router-view/></el-main>
		</el-container>
		<el-footer></el-footer>
	</el-container>
	
</template>
<script>
import vHeader from './header.vue'
	export default {
		components:{
			vHeader
		}
	}
</script>