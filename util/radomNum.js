export default class RadomNum {

	/**
	 * 包含两端
	 * @param {number} Min 
	 * @param {number} Max 
	 * @returns 
	 */
	static includeBoth(Min, Max) {
		const Range = Max - Min;
		const Rand = Math.random();
		const num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	}
	/**
	 * 包含左边
	 * @param {number} Min 
	 * @param {number} Max 
	 * @returns 
	 */
	static includeLeft(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.floor(Rand * Range); //舍去
		return num;
	}
	/**
	 * 包含右边
	 * @param {number} Min 
	 * @param {number} Max 
	 * @returns 
	 */
	static includeRight(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		if (Math.round(Rand * Range) == 0) {
			return Min + 1;
		}
		var num = Min + Math.round(Rand * Range);
		return num;
	}

	/**
	 * 不包含两端
	 * @param {number} Min 
	 * @param {number} Max 
	 * @returns 
	 */
	static radom(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		if (Math.round(Rand * Range) == 0) {
			return Min + 1;
		} else if (Math.round(Rand * Max) == Max) {
			return Max - 1;
		} else {
			var num = Min + Math.round(Rand * Range) - 1;
			return num;
		}
	}
}