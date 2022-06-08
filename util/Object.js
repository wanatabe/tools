class ObjectUtil {
    /**
     * 判断对象是否为空对象
     * @param obj
     * @returns {boolean}
     */
    static isEmpty(obj) {
        for (const key in obj) {
            return false;
        }
        return true;
    }

    /**
     * 判断对象是否null和undefined
     * @param object
     * @returns {boolean}
     */
    static isNull(object) {
        if (object === null) return true;
        return object === 0;
    }

    /**
    * 判断对象是否是数组
    * @param object
    * @returns {any}
    */
    static isArray(object) {
        if (!object) return false;
        return Array.isArray(object);
    }

    static cloneDeep(data) {
        if (!data || typeof data !== 'object') return data
        let cloneData = Array.isArray(data) ? [] : {}
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const item = data[key];
                if (typeof item === 'object') {
                    cloneData[key] = this.cloneDeep(item)
                } else {
                    cloneData[key] = item
                }
            }
        }
        return cloneData
    }
}
