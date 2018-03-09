import toolkits from './toolkits.js'


class Checker {
	constructor (matrix) {
		this._matrix = matrix;
		this._matrixMarks = toolkits.matrix.makeMatrix(true)	
	}

	get isSuccess () {
		return this._isSuccess
	}

	checkArray ( array ) {
		const len = array.length;

		for(let i = 0; i < len; i++){
			const v = array[i];

			if(v.error){
				continue;
			}

			if(v.num === 0 ){
				v.error = true;
				continue;
			}

			// 检查是否有重复
			
			for(let j = i + 1; j< len - 1; j++){
				if(v.num === array[j].num){
					v.error = v.fixed ? false : true
					array[j].error = array[j].fixed ? false : true
				}
			}
		}
	}

	check() {
		this.checkRows()
		this.checkCols()
		this.checkBoxes()

		this._isSuccess = this._matrix.every(row => row.every(cell => !cell.error))
		console.log(this._isSuccess)
		return this._isSuccess;
	}

	// 检查行
	checkRows () {
		const matrix = this._matrix;

		matrix.forEach( row => {
			console.log(row)
			this.checkArray(row)
		});

		console.log(matrix)
	}
	// 检查列
	checkCols () {
		const matrix = this._matrix;

		for (let colIndex = 0; colIndex < 9; colIndex ++){
			const cols = []

			for ( let rowIndex = 0; rowIndex < 9; rowIndex ++){
				cols[rowIndex] = matrix[rowIndex][colIndex]
			}

			this.checkArray(cols)
		}
	}
	// 检查宫
	checkBoxes () {
		const matrix = this._matrix;

		for(let boxIndex = 0; boxIndex < 9; boxIndex++){
			const boxes = toolkits.boxTool.getBoxCells(matrix, boxIndex)
			console.log(boxes)
			this.checkArray(boxes);

			// for(let cellIndex = 0; cellIndex < 9; cellIndex++){
			// 	if(!marks[cellIndex]){
			// 		const {rowIndex, colIndex} 
			// 			= util.boxTool.convertFromeBoxIndex(boxIndex, cellIndex)
			// 		matrixMarks[rowIndex][colIndex] = false;
			// 	}
				

			// }
		}
	}
}

export default  Checker