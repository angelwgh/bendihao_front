<template>
	<div class="grid popup-numbers"
		 :style="{top:positions.top, left:positions.left}"
		 @click="click">
		
		<div class="row">
			<span>1</span><span>2</span><span>3</span>
		</div>
		<div class="row">
			<span>4</span><span>5</span><span>6</span>
		</div>
		<div class="row">
			<span>7</span><span>8</span><span>9</span>
		</div>
		<div class="row">
			<span class="marker1"></span><span class="empty"></span><span class="marker2"></span>
		</div>
	</div>
</template>
<script>
	export default {
		props:{
			position:{
				type: Object,
				default: {
					row:0,
					col:0
				}
			}
		},
		computed: {
			positions ()  {
				const top = this.position.row * 30 > 110 ? 110 : this.position.row * 30;
				const left = this.position.col * 30 > 150 ? 160 :  this.position.col * 30 + 10
				return {
					top: top + 'px',
					left: left + 'px'
				}
			}
		},
		methods: {
			click (event) {
				const dom = event.target
				if(dom.tagName !== 'SPAN') return 

				const obj = {}
				if(dom.className){
					obj.data = dom.className
					obj.type = 'class'
				}else {
					obj.data = parseInt(dom.innerHTML),
					obj.type = 'num'
				}
				// console.log()
				// console.log(event.target.className)
				this.$emit('select', obj)
			}
		}
	}
</script>