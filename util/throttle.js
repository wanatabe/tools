/**
 * 节流
 * 高频事件触发，但在n秒内只会执行一次。
 * @param {Function} fn
 * @param {number} wait 延时 ms
 * @param {boolean} immediate  是否立即执行
 */
function throttle(fn, wait, immediate) {
	let timeout
	let previous = 0
	return function () {
		let _this = this
		let args = arguments
		if (immediate) {
			let now = Date.now()
			if (now - previous > wait) {
				fn.apply(_this, args)
				previous = now
			}
		} else {
			if (!timeout) {
				timeout = setTimeout(() => {
					timeout = null
					fn.apply(_this, args)
				}, wait)
			}
		}
	}
}
