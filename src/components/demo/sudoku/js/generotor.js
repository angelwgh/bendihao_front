/**
 * 生成数独解决方案
 * 从数字1-9，从行0-8，随机选一列，
 * 检查是否可以填入
 * 如果所有列号都不能填入，则返回上一行选择下一个随机列重新填写
 */
import toolkits from './toolkits.js' 

class Generotor {
	constructor () {
		// 如果矩阵生成失败，则重新生成
		while(!this.generate()){
			
		}
	}

	generate () {
		// 入口方法
		// 生成数据矩阵
		this.matrix = toolkits.matrix.makeMatrix()
		this.vueMatrix = toolkits.matrix.makeMatrix()
		console.log(this.vueMatrix)
		//随机位置矩阵
		this.orders = toolkits.matrix.makeMatrix()
						// 有序
						.map(row => row.map((v,i) => i))
						// 每一行都随机打乱
						.map(row => toolkits.matrix.shuffle(row))
		// 填写1-9数字
		for (let n = 1; n <= 9; n++){
			if(!this.fillNumber(n)){
				return false
			}
		}

		return true
	}

	fillNumber (n) {
		// 在每一行中填入数字
		return this.fillRow(n, 0);
	}

	fillRow(n, index){
		if(index > 8) {
			return true // 填写完成
		}

		const row = this.matrix[index];
		const vueRow = this.vueMatrix[index];
		const orders = this.orders[index];

		for( let i = 0; i < 9; i ++){
			const colIndex = orders[i];

			// 如果这个位置已经填写，则跳过
			if(row[colIndex]){
				continue;
			}

			// 检查格子是否可以填入数字n
			if( !toolkits.matrix.checkFillable(this.matrix, n, index, colIndex) ){
				continue;
			}
			row[colIndex] = n;
			
			vueRow[colIndex] = {
				num: n,
				row: index,
				col: colIndex
			}
			

			// 当前行填写n成功，递归调用，在下一行中填写n
			// 如果填写失败，就继续寻找当前行下一个位置
			// 如果下一行填写失败，则返回本行继续寻找下一个位置
			if(!this.fillRow(n, index + 1)) {
				vueRow[colIndex].num = row[colIndex] = 0;
				continue;
			}

			return true
		}

		return false
	}
}

export default  Generotor