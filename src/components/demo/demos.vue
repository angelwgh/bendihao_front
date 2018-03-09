<template>
	<div>
		<router-view/>
		<div class="m-demo-list">
		<div class="demo-item" v-for="item in list" @click="openDemo(item.id)">
			<div> {{item.id}}</div>
			<div class="title"> {{item.title}}</div>
			<div> {{item.name}}</div>
		</div>
	</div>
	</div>
	
</template>
<script>
	export default {
		data () {
			return {
				list: []
			}
		},
		methods: {
			openDemo (id) {
				this.$router.push({name: 'demo', params: {id}})
			}
		},
		created () {
			// console.log(this)
			this.$axios({
				url: '/ajax/demosController/getDemoesList',
				params: {
					pageNo: 1,
					pageSize: 10
				}
			})
			.then((ret) => {
				console.log(ret)
				this.list = ret.data.jsonBody
			})
			.catch((err) => {
				console.log(err)
			})
		}
	}
</script>
<style>
	.m-demo-list{
		display: flex;
		justify-content: space-between;
		flex-wrap:wrap;
/*		transform-style: preserve-3d;
		perspective: 2000px;*/
	}

	.m-demo-list .demo-item{
		margin: 10px;
		flex:0, 0;
		width: 300px;
		height: 200px;
		text-align: center;
		border: 1px solid #ccc;
		border-radius: 10px;
		cursor: pointer;
		transition: 0.4s;

	}

	.m-demo-list .demo-item:hover {
		box-shadow: 0 0 5px 1px #ccc;
		
		transform: scale(1.01);
		


	}

	.m-demo-list .demo-item > div {
		height: 66px;
		line-height: 66px;
	}

	.m-demo-list .demo-item > div.title{
		font-family: '微软雅黑';
		font-size: 40px;
		font-weight: bold;
	}
</style>