class MapUtil {
    #AMap = null
    #map = null
    #hospitalMarker
    #carMarker = {}
    #driveLine = {}

    static instance

    constructor(AMap, map) {
        this.#AMap = AMap
        this.#map = map
    }

    getAMap() {
        return this.#AMap
    }

    getMap() {
        return this.#map
    }

    /**
     * 初始化
     * @param mapContainer 地图容器id
     * @param apiKey  api密钥
     * @param version api版本
     */
    static async init(mapContainer, apiKey, version) {
        if (!this.instance) {
            return this.createMap(mapContainer, apiKey, version)
        }
        return this.instance
    }

    static async createMap(mapContainer, apiKey, version) {
        const AMap = await AMapLoader.load({
            key: apiKey, // 申请好的Web端开发者Key，首次调用 load 时必填
            version: version, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ['AMap.Scale', 'AMap.Driving', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.ToolBar'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
        const map = new AMap.Map(mapContainer, {
            expandZoomRange: true,
            zoom: 13,
            zooms: [3, 20],
        });
        return new MapUtil(AMap, map)
    }

    /**
     * 添加比例尺
     */
    addControl() {
        const scale = new this.#AMap.Scale();
        this.#map.addControl(scale);
    }

    /**
     * 设置地图中心点
     * @param {[number,number]} lnglat 经纬度
     */
    setMapCenter(lnglat) {
        if (!this.#map) return
        this.#map.setCenter(lnglat);
    }

    /**
     * 设置地图层级
     * @param zoom 值范围：3-20
     */
    setMapZoom(zoom) {
        if (!this.#map) return
        this.#map.setZoom(zoom);
    }

    /**
     * 设置点标记
     * @param lnglat
     * @param content
     * @return {*}
     */
    setMarker(lnglat, content) {
        if (!this.#map) return
        const marker = new this.#AMap.Marker({
            position: lnglat, //位置
            content: content,
            anchor: 'top-left',
        });
        this.#map.add(marker);
        return marker;
    }


    /**
     * 清除标点
     * @param marker
     */
    clearMarker(marker) {
        if (!marker) return;
        if (Array.isArray(marker)) {
            for (let index = 0; index < marker.length; index++) {
                if (!marker[index]) continue;
                marker[index].setMap(null);
                marker[index] = null;
            }
        } else {
            marker.setMap(null);
            marker = null;
        }
    }

    /**
     * 设置点标记label
     * @param marker 点
     * @param content
     * @param offset label偏移两
     */
    setMarkLabel(marker, content, offset) {
        marker.setLabel({
            direction: 'top',
            offset: new this.#AMap.Pixel(offset?.x || 0, offset?.y || 0), //设置文本标注偏移量
            content: content, //设置文本标注内容
        });
    }

    /**
     * 路径规划
     * @param map 地图对象
     * @param startLngLat 起点
     * @param endLngLat 终点
     * @param waypoints 途经点
     * @returns
     */
    routePlan(map, startLngLat, endLngLat, waypoints) {
        if (!map) return;
        const drive = new this.#AMap.Driving({
            map: map,
            autoFitView: false,
            hideMarkers: true,
        });
        drive.search(startLngLat, endLngLat, {waypoints}, status => {
            if (status !== 'complete') {
                console.error('路径规划失败');
            }
        });

        return drive;
    }

    /**
     * 重置地图
     */
    resetMap() {
        if (!this.#map) return;
        this.#map.clearMap();
        this.drawHospital();
        this.setMapZoom(13);
    }

    /**
     * 绘制医院
     *
     */
    drawHospital(hospital = {}, content) {
        if (!this.#AMap || !this.#map) return
        const {hospitalName = '重庆第四人民医院', longitudeVsLatitude = [106.545799, 29.552443]} = hospital;
        if (!content) {
            content = MapUtil.#createIcon('hospital', {hospitalName});
        }
        this.#hospitalMarker = this.setMarker(longitudeVsLatitude, content);
        this.setMapCenter(longitudeVsLatitude);

    }

    /**
     * 设置患者位置
     * @param targetGps 患者经纬度
     * @param option    患者基础信息
     * @param content
     */
    drawPatient(targetGps, option, content) {
        if (!this.#AMap || !this.#map) return;
        let useContent = content
        if (!content) {
            useContent = MapUtil.#createIcon('patient', option);
        }
        this.patientMarker = this.setMarker(targetGps, useContent);
        this.#map.setFitView();

    }

    /**
     * 画车辆位置图标
     */
    drawCar(position) {
        if (!this.#AMap) return;
        if (!position?.longitude) return

        let carMarker = this.#carMarker[position.licensePlate];
        if (carMarker && this.#map) {
            carMarker.setMap(null);
            carMarker = null;
        }
        const carPosition = [position.longitude, position.latitude];
        const content = MapUtil.#createIcon('car', {licensePlate: position.licensePlate});
        this.#carMarker[position.licensePlate] = this.setMarker(carPosition, content);

        // 终点
        let endPosition;
        if (position.status >= 1 && position.status < 5) {
            // 到达目的地前
            endPosition = this.patientPosition;
        } else {
            // 到达目的地后
            endPosition = position.targetGps.split(',');
        }
        if (!endPosition) return;

        const startLngLat = new this.#AMap.LngLat(position.longitude, position.latitude);
        const endLngLat = new this.#AMap.LngLat(endPosition[0], endPosition[1]);
        const newDrive = this.routePlan(this.#map, startLngLat, endLngLat);
        const drive = this.#driveLine[position.licensePlate];
        if (!drive) {
            this.#driveLine[position.licensePlate] = [newDrive];
        } else {
            this.#driveLine[position.licensePlate].push(newDrive);
            if (drive.length === 2) {
                drive[0].clear();
                this.#driveLine[position.licensePlate].shift();
            }
        }
    }

    static #createIcon(type, data) {
        if (!data) data = {}
        let icon
        let title

        switch (type) {
            case 'car':
                icon = `<i class='icon-hieip icon-che'></i>`;
                title = ` <div class='title-text'>
                            <span>
                            ${data.licensePlate || ''}
                            </span>
                        </div>`;
                break;
            case 'hospital':
                icon = `<svg class='iconsvg' aria-hidden='true'>
                             <use xlink:href='#icon-dingwei_yiyuan'></use>
                        </svg>`;
                title = ` <div class='title-text'>
                            <span>
                            ${data.hospitalName || ''}
                            </span>
                        </div>`;
                break;
            default:
                icon = '<i class="icon-hieip icon-dingwei_ren"></i>';
                title = `<div class='people-base-info'>
                        <span>${data.targetPosition || ''}</span>
                    </div>
                    <div class='people-other-info'>
                        <i class='icon-oui icon-yuanqiantubiao_shi-'></i>
                        <span>${data.callReason || '未知'}</span>
                    </div>
                   `;
                break;
        }
        return `<div class='map-marker'>
                    <div class='map-marker-text-container ${type === 'patient' && 'people'}'>
                       ${title}
                    </div>

                    <div class='map-marker-icon ${type === 'hospital' && 'nobackground'}'>
                       ${icon}
                    </div>
                </div>`;
    }
}
