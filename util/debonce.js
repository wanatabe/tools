/**
 * 防抖 
 * 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时
 * @param {Function} fn
 * @param {number} wait 延时 单位ms
 * @param {boolean} immediate 是否立即执行
 */
function debounce(fn, wait, immediate) {
	let timeout;

	return function () {
		let _this = this;
		let args = arguments;

		if (timeout) clearTimeout(timeout);

		if (immediate) {
			let callNow = !timeout;
			timeout = setTimeout(() => {
				timeout = null;
			}, wait)
			if (callNow) fn.apply(_this, args)
		} else {
			timeout = setTimeout(function () {
				fn.apply(_this, args)
			}, wait);
		}
	}
}
