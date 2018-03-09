<template>
	<div class="group">
		<div class="group-item">
			<div class="title" v-text="data.title"></div>
			<div class="content" v-text="content"></div>
		</div>
	</div>
</template>
<script>

	const content =' ` dragenter`\
			当外界有一些拖拽的东西进入到元素区域时触发事件\
			```\
			ele.addEventListener(\'dragenter\')\
			```\
			` dragenter`\
			拖拽离开事件\
			```\
			ele.addEventListener(\'dragleave\')\
			```\
			\
			` dragover`\
			如果想要捕获drop事件,就一定得在该事件中阻止默认事件\
			当拖拽一些东西放到元素区域时触发事件\
			```\
			ele.addEventListener(\'dragover\',function(){\
			    e.preventDefault();\
			    e.stopProagation()\
			})\
			```\
			\
			` dragenter`\
			当拖拽一些东西放到元素区域时触发事件\
			```\
			ele.addEventListener(\'drop\',function(e){\
			     e.dataTransfer.getData(\'text/plain\')  //获取文本内容\
			     e.dataTransfer.getData(\'text/uri-list\')  //图片获取链接地址\
			})\
			```\
			'
	const data = {
		content,
		title: 'js文件拖拽操作',
		creatTime: '2017.06.13 08:47',
		autor: 'angelwgh',
		view: 14,
		zan: 0,
		star: 0,

	}
	export default {
		data () {
			return {
				data: data
			}
		},

		computed: {
			content () {
				return data.content.replace(/\n/,'')
			}
		}
	}
</script>