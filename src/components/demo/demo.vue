<template>
	<div v-loading="!demoInfo">
		<el-button-group>
		  <el-button size="small" type="primary" icon="el-icon-arrow-left" @click="back">返回</el-button>
		  
		</el-button-group>
		<div v-if="demoInfo">
			<component :is="demoInfo.name"></component>
		</div>
		
	</div>
</template>
<script>

import { mapGetters, mapMutations } from 'vuex';

let componentsPath = './sudoku/sudoku.vue';

	export default {
		components:{
			sudoku: () => import('./sudoku/sudoku.vue'),
			jquery: () => import('./jquery/jquery.vue')
		},
		data () {
			return {
				demoInfo: null,
				demoName: 'sudoku',

			}
		},
		methods: {
			...mapMutations({
		        setDefaultActive: 'setActiveHeadNav'
		    }),
			back () {
				// 返回上一页
				this.$router.go(-1)
				// this.loading = false
			},
		    getDemoDetail() {
		    	// console.log(this.$route.params)
		    	const id = this.$route.params.id
		    	this.$axios({
		    		url: '/ajax/demosController/getDemoDetail',
		    		params: {
		    			id,
		    		}
		    	})
		    	.then((ret) => {
		    		// console.log(ret)
		    		
		    		this.demoInfo = ret.data.jsonBody
		    	})
		    	.catch((err) => {
		    		console.log(err)
		    	})
		    }
		},
		created () {

			// console.log(this.$route)

			
		},
		mounted () {
			this.setDefaultActive('/demos');
			this.getDemoDetail()
	    }
	}
</script>