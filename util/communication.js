/**
 * 简易发布订阅模式
 * 2022-7-25
 */

export default class Publish {
	#state = {}
	static instance

	/**
	 * 设置值
	 * @param {string} code 
	 * @param {any} data 
	 */
	setState = (code, data) => {
		this.#state[code] = data
	}

	/**
	 * 获取值
	 * @param {string} code 
	 * @returns 
	 */
	getState = (code) => {
		return this.#state[code]
	}

	static init = () => {
		if (this.instance) {
			return this.instance
		} else {
			return (this.instance = new Publish())
		}
	}

	/**
	 * 发布
	 * @param {string} code 
	 * @param {any} data 
	 */
	static publish(code, data) {
		if (!this.instance) {
			this.init()
		}
		let sub = this.instance.getState(code)
		if (!sub) {
			sub = []
		}
		sub.value = data
		sub.forEach((fn) => {
			fn(sub.value)
		})
	}

	/**
	 * 订阅
	 * @param {string} code 
	 * @param {(data:any)=> any} fn 
	 */
	static subscribe(code, fn) {
		if (!this.instance) {
			this.init()
		}
		let sub = this.instance.getState(code)
		if (!sub) {
			this.instance.setState(code, [])
			sub = this.instance.getState(code)
		}
		sub.push(fn)
	}
}