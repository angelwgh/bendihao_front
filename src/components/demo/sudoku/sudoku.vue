<template>
	<div class="m-skdoku">
		<div class="title">
			<h1>数独游戏</h1>
		</div>
		<div class="container grid">
			<div class="row" v-for="(row, rowIndex) in matrix"
				:class="{
					'row-g-bottom':rowIndex%3 === 2,
		  			'row-g-top':rowIndex %3 === 0,
		  			'row-g-middle': rowIndex %3 === 1
				}">
				<span class="col" v-for="(col, colIndex) in row"
					  @click="popup(col,$event)" 
					  :style="{height: celHeight +'px', lineHeight: celHeight +'px'}"
					  :class="{
					  			'col-g-right':colIndex%3 === 2,
					  			'col-g-left':colIndex %3 === 0,
					  			'col-g-center': colIndex %3 === 1,
					  			'num-fixed': col.fixed === true,
					  			'empty': col.empty === true,
					  			'marker1': col.marker1 === true,
					  			'marker2': col.marker2 === true,
					  			'error':col.error === true

					  		}"
					  >
					{{col.num}}
				</span>
			</div>
			<popup-numbers @select="selectnum"
							v-show="popupNumbersShow"
							:position="popupNumbersPosition"></popup-numbers> 
		</div>
		<div class="dashboard">
			<el-button-group>
			  <el-button size="small" type="primary" @click="check">检查</el-button>
			  <el-button size="small" type="primary" @click="reset">重置</el-button>
			  <el-button size="small" type="primary" @click="clear">清理</el-button>
			  <el-button size="small" type="primary" @click="rebuild">重建</el-button>
			</el-button-group>
			<!-- <div class="buttons">
				<button type="button" @click="check">检查</button>
				<button type="button" id="reset">重置</button>
				<button type="button" id="clear">清理</button>
				<button type="button" @click="rebuild">重建</button>
			</div> -->
		</div>
	</div>
</template>
<script>
	import popupNumbers from './pupnumbers.vue'
	import toolkist from './js/toolkits.js'
	import './style/style.less'
	import Sudoku from './js/sudoku.js'

	// console.log(new generate())
	// console.log(toolkist.matrix.makeMatrix())
	
	export default {
		components: {
			popupNumbers
		},
		data () {
			return {
				popupNumbersPosition:{
					row:0,
					col:0
				},
				popupNumbersShow: false,
				celHeight: 'auto',
				matrix: toolkist.matrix.makeMatrix()
			}
		},
		computed: {
			// matrix () {

			// 	return matrix
			// }
		},
		methods:{
			init() {
				this.setBoxHeight()
				this.rebuild()
			},
			selectnum (data) {
				console.log(data)
				const cell = this.currentCell ;
				if(data.type == 'num'){
					cell.num = data.data
					cell.empty = false
				} else if(data.type == 'class'){
					if(data.data === 'empty'){
						cell.num = 0;
						cell.empty = true;
					}else {
						cell[data.data] = !cell[data.data];
					}
					
				}
				
				this.popupNumbersShow = false;
			},
			setBoxHeight () {
				// 设置格子高度
				const span = this.$el.getElementsByClassName('col')[0]
				this.celHeight = span.offsetWidth;
				// console.log(span.offsetWidth)
			},

			check() {

				if(this.sudoku.check()){
					this.$alert('游戏成功', '提示', {
			          confirmButtonText: '确定',
			          callback: action => {
			            // this.$message({
			            //   type: 'info',
			            //   message: `action: ${ action }`
			            // });
			          }
			        });
				}

			},

			rebuild(){
				const sudoku = this.sudoku = new Sudoku()
				sudoku.make()
				// solutionMatrix
				this.matrix = sudoku.vuePuzzleMatrix
			},

			reset() {
				this.sudoku.reset()
				console.log(this.matrix)
			},

			clear () {
				this.sudoku.clear()
			},

			popup (cell,event) {
				if (cell.fixed) return;
				this.popupNumbersShow = true;
				this.popupNumbersPosition.row = cell.row;
				this.popupNumbersPosition.col = cell.col;
				// cell.num = 1
				// cell.empty = false
				this.currentCell = cell;
			}
		},
		mounted() {

			this.init()
			
			// console.log(this)
		}
	}
</script>
