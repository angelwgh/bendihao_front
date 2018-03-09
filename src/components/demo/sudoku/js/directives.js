/**
 * 自定义指令
 */

class Directives {
	squareBox (el) {

		el.addEventListener('load', () => {
			console.log(el.offsetWidth)
		})

	}
}

export default new Directives()