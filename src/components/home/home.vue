<template>
	
	<el-container>
		<el-header>
			<v-header></v-header>
		</el-header>
		<el-aside>侧边</el-aside>
		<el-main></el-main>
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