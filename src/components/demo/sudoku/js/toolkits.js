/**
 * 工具集
 */


//矩阵工具

class Matrix {
	constructor () {

	}

	makeRow ( v = 0 ) {
		//生成行
		const array = new Array(9);

		array.fill(v)

		return array
	}

	makeMatrix ( v = 0 ){
		// 生成矩阵
		const makeRow = this.makeRow

		const array = Array.from( { length: 9}, () => makeRow (v))

		return array;
	}

	/**
	 * fisher-yates洗牌算法
	 *用于随机排列一维数组
	 *具体算法是：遍历数组的每一个元素，把它和位于它之后的一个随机位置的
	 *			  元素交换位置
	 */
	shuffle ( array ) {
		const endIndex = array.length - 2;

		for ( let i = 0; i <= endIndex; i++){
			// 获取一个i后面的随机位置
			const j = i + Math.floor( Math.random() * ( array.length - i) );

			// 交换array[i] <=> array[j]
			[array[i], array[j]] = [array[j], array[i]]
		}

		return array;
	}

	/**
	 * 检查指定位置是否可以填写数字n
	 */
	checkFillable (matrix, n, rowIndex, colIndex){
		// 获取格子所在行、列、宫的数据
		const row = matrix[rowIndex];
		const col = this.makeRow()
					.map((v, i) => matrix[i][colIndex]);
		const { boxIndex } = boxTool.convertToBoxIndex(rowIndex, colIndex);

		const box = boxTool.getBoxCells(matrix, boxIndex);

		for(let i = 0; i< 9; i++){
			// 如果所在行、列、宫里面已经有这个数字，则不能填写
			if(row[i] === n || col[i] === n || box[i] === n){
				return false
			}
		}

		return true;
	}
}

const boxTool = {

	// 把格子转化成格子所在宫的序号和格子在宫里的序号
	convertToBoxIndex(rowIndex, colIndex) {
		return {
			// 格子所在宫的序号
			boxIndex: Math.floor( rowIndex / 3 ) * 3 + Math.floor( colIndex / 3),
			// 格子在宫里面的序号
			cellIndex: rowIndex % 3 * 3 + colIndex % 3
		}
	},

	// 把格子所在宫的序号和格子在宫里的序号转化成格子的坐标
	convertFromeBoxIndex (boxIndex, cellIndex) {
		return {
			rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),

			colIndex: boxIndex % 3 * 3 + cellIndex % 3
		}
	},

	// 获取宫里面的数据
	getBoxCells(matrix, boxIndex) {
		// 宫起始格子坐标
		const startRowIndex = Math.floor(boxIndex / 3) * 3;
		const startColIndex = boxIndex % 3  * 3;
		const result = [];

		for( let cellIndex = 0; cellIndex < 9; cellIndex++){
			const rowIndex = startRowIndex + Math.floor(cellIndex / 3);
			const colIndex = startColIndex + cellIndex % 3;

			result.push(matrix[rowIndex][colIndex])
		}

		return result;
	}
}

export default {
	matrix: new Matrix (),
	boxTool: boxTool
}