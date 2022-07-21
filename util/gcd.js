/**
 * 最大公约数
 */

class GCD {
	/**
	 * 辗转相除法
	 * 
	 * 例如，求（319，377）：
	 *	∵ 319÷377=0（余319）∴（319，377）=（377，319）；
	 *  ∵ 377÷319=1（余58） ∴（377，319）=（319，58）；
	 *  ∵ 319÷58=5（余29） ∴ （319，58）=（58，29）；
	 *  ∵ 58÷29=2（余0）   ∴ （58，29）= 29；
	 *  ∴ （319，377）=29。
	 * @param {number} b 
	 * @param {number} a 
	 * @returns 
	 */
	static fun1(a, b) {
		if (a % b === 0) {
			return b
		}
		return fun1(b, a % b)
	}
	/**
	 * 更相减损法
	 * 第一步：任意给定两个正整数；判断它们是否都是偶数。若是，则用2约简；若不是则执行第二步。
···* 第二步：以较大的数减较小的数，接着把所得的差与较小的数比较，并以大数减小数。继续这个操作，直到所得的减数和差相等为止。
	 * @param {number} a 
	 * @param {number} b 
	 * @returns 
	 */
	static fun2(a, b) {
		if (a === b) {
			return b
		}
		if (a % 2 === 0 && b % 2 === 0) {
			return fun2(a / 2, b / 2)
		}
		if (a > b) {
			a = a - b
		} else {
			b = b - a
		}
		return fun2(a, b)
	}

	/**
	 * 获取数组所有元素最大公约数
	 * @param {Array<number>} arr 
	 */
	static fun3(arr) {
		if (!Array.isArray(arr)) throw new Error('请传入数组')
		let gcd = arr[0]
		for (let index = 1; index < arr.length; index++) {
			gcd = this.fun1(gcd, arr[index])
		}
		return gcd
	}
}