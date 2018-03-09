// 生成数独游戏
// 
// 1。生成完成的解决方案： Generator
// 2. 随机去除部分数据


import Generator from'./generotor.js'
import Checker from './check.js'

class Sudoku {
	constructor () {
		this.init()
	}

	init () {
		this.generator()
	} 

	generator () {
		const generator = new Generator()

		this.solutionMatrix = generator.matrix
		this.vueSolutionMatrix = generator.vueMatrix
	}

	make( lv = 5 ){
		// 生成迷盘
		
		this.puzzleMatrix = this.solutionMatrix.map(row => {
			return row.map(cell => Math.random() * 9 < lv ? 0 : cell)
		})
		this.vuePuzzleMatrix = this.vueSolutionMatrix.map(row => {
			return row.map(cell => {
				if(Math.random() * 9 < lv){
					cell.num = 0;
					cell.fixed = false;
					cell.empty = true;
					cell.marker1 = cell.marker2 = false;
				}else{
					cell.fixed = true;
					cell.empty = false;
				}

				cell.error = false;

				return cell;
			})
		})
	}

	check () {
		const checker = new Checker(this.vuePuzzleMatrix)
		if(checker.check()){
			return true
		}
	}

	reset () {
		// console.log(this.vuePuzzleMatrix)
		this.vuePuzzleMatrix = this.vuePuzzleMatrix.map(row => {
			return row.map(cell => {
				// console.log(cell)
				if(cell.fixed == false ){
					cell.num = 0;
					cell.empty = true;
					cell.error = cell.marker1 = cell.marker2 = false;
				}
				return cell
			})
		})
	}

	clear () {
		this.vuePuzzleMatrix.forEach( row => {
			row.forEach( cell => {
				if(cell.fixed == false ){
					cell.error = false
				}
			});
		});
	}
}

export default Sudoku