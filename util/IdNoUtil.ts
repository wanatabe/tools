/**
 * 身份证工具
 */
export class IdNoUtil {
    static check = idNo => {
        if (!idNo) return;
        // 获取身份证长度
        const length = idNo.length;
        // 身份证号 目前只存在 【15】与【18】位
        if (length !== 15 && length !== 18) return;
        return true;
    };

    /**
     * 获取【性别】
     * @param idNo 身份证号
     */
    static getSex = idNo => {
        if (!IdNoUtil.check(idNo)) return;
        switch (idNo.length) {
            case 15:
                // 【15】位身份证，【性别】为第【15】位,判断规则: 奇【男】偶【女】,又名 【男】单【女】双
                return IdNoUtil._getSex(idNo.substr(15));
            case 18:
                // 【18】位身份证，【性别】为第【17】位,判断规则: 奇【男】偶【女】,又名 【男】单【女】双
                return IdNoUtil._getSex(idNo.substr(16, 1));
            default:
                break;
        }
    };

    /**
     * 获取年龄: 根据年月计算
     * @param idNo 身份证号
     * @param nowDate 当前服务器时间
     */
    static getAgeByYearAndMonth = (idNo, nowDate?: Date) => {
        if (!IdNoUtil.check(idNo)) return;
        switch (idNo.length) {
            case 15:
                // 【15】位身份证，【出生年】为【19】加第【7至8】位,【出生月】为第【9至10】位
                return IdNoUtil._getAgeByYearAndMonth('19' + idNo.substr(6, 2), idNo.substr(8, 2), nowDate);
            case 18:
                // 【18】位身份证，【出生年】为第【7至10】位,【出生月】为第【11至12】位
                return IdNoUtil._getAgeByYearAndMonth(idNo.substr(6, 4), idNo.substring(10, 2), nowDate);
            default:
                break;
        }
    };

    /**
     * 获取年龄: 根据年月计算
     * @param year 年
     * @param month 月
     * @param nowDate 当前服务器时间
     * @private
     */
    static _getAgeByYearAndMonth = (year, month, nowDate?: Date) => {
        nowDate = nowDate ? nowDate : new Date();
        // 获取当前服务器时间【年】
        let nowYear = nowDate.getFullYear();
        // 获取当前服务器时间【月】
        const nowMonth = nowDate.getMonth();
        // 获取当前服务器时间【月】小于身份证时间【月】,年则减【1】
        if (nowMonth < month) {
            nowYear -= 1;
        }
        const data = nowYear - year;
        // 年龄不允许小于【0】
        return data < 0 ? 0 : data;
    };

    /**
     * 判断性别
     * 判断规则: 奇【男】偶【女】,又名 【男】单【女】双
     * @param data 判断值
     * @private
     */
    private static _getSex = data => {
        return data % 2 === 0 ? '2' : '1'; // 1:男;2:女, 注：编码规则为【急诊程序】性别字典编码死规则,其他程序由其自身决定
    };
}
