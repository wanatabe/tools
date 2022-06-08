const list = document.querySelectorAll('li')
const ul = document.querySelector('ul')
const imgShow = document.getElementById('imgShow')

ul.addEventListener('click', (event) => {
	for (let index = 0; index < list.length; index++) {
		const item = list[index];
		item.classList.remove('active')
	}
	const activeDom = event.target
	activeDom.classList.add('active')
	canvasObj.changeGraphType(activeDom.innerText)
	switch (activeDom.innerText) {
		case 'revoke':
			canvasObj.revoke()
			break;
		case 'save':
			canvasObj.saveToImg()
			break;
		default:
			break;
	}
})

/**
 * 点击空白处关闭弹框
 */
imgShow.addEventListener('click', (event) => {
	imgShow.classList.remove('show')
	let firstChild
	while ((firstChild = imgShow.firstChild)) {
		firstChild.remove()
	}
})



/**
 * canvas工具类
 */
class canvasUtil {
	constructor(canvasId) {
		this.graphType = 'pen'
		this.imageData = []
		this.canvas = document.getElementById(canvasId)
		this.ctx = this.canvas.getContext('2d')
		this.canvas.addEventListener('mousedown', this.handleMouseDown)
	}

	/**
	 * 获取context
	 * @returns 
	 */
	getContext = () => this.ctx

	/**
	 * 修改绘制类型
	 * @param {string} type 
	 */
	changeGraphType = (type) => {
		this.graphType = type
	}

	/**
	 * 初始化样式
	 */
	initStyle = () => {
		this.ctx.lineWidth = 1
		this.ctx.fillStyle = 'red'
		this.ctx.strokeStyle = 'red'
		this.ctx.globalAlpha = 1
	}

	/**
	* 画笔 绘制自由线段
	*/
	drawFreenLine = (x, y) => {
		this.initStyle()
		this.ctx.lineTo(x, y)
		this.ctx.stroke()
	}

	/**
	 * 直线
	 * @param {number} x 起点
	 * @param {number} y 起点
	 * @param {number} x1 终点
	 * @param {number} y1 终点
	 */
	drawLine = (x, y, x1, y1) => {
		this.initStyle()
		this.ctx.beginPath()
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(x1, y1)
		this.ctx.stroke()
	}

	/**
	 * 矩形
	 * @param {number} x 起点
	 * @param {number} y 起点
	 * @param {number} x1 终点
	 * @param {number} y1 终点
	 */
	drawRect = (x, y, x1, y1) => {
		const w = x1 - x
		const h = y1 - y
		this.initStyle()
		this.ctx.beginPath()
		this.ctx.rect(x, y, w, h)
		this.ctx.stroke()


	}

	/**
	 * 圆
	 * @param {number} x 起点
	 * @param {number} y 起点
	 * @param {number} x1 终点
	 * @param {number} y1 终点
	 */
	drawCircle = (x, y, x1, y1) => {
		this.initStyle()
		this.ctx.beginPath()

		const w = (x1 - x) / 2
		const h = (y1 - y) / 2
		const _w = Math.abs(w)
		const _h = Math.abs(h)

		this.ctx.ellipse(x + w, y + h, _w, _h, 0, 0, 2 * Math.PI)
		this.ctx.stroke()
	}

	/**
	 * 三角形
	 * @param {number} x 起点
	 * @param {number} y 起点
	 * @param {number} x1 终点
	 * @param {number} y1 终点
	 */
	drawTriangle = (x, y, x1, y1) => {
		this.initStyle()
		this.ctx.beginPath()
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(x1, y1)
		this.ctx.lineTo(x - (x1 - x), y1)
		this.ctx.closePath()
		this.ctx.stroke()
	}

	/**
	 * 橡皮擦
	 * @param {number} x 起点
	 * @param {number} y 起点
	 * @param {number} x1 终点
	 * @param {number} y1 终点
	 */
	eraser = (x, y, x1, y1) => {
		this.ctx.lineCap = 'round'
		this.ctx.clearRect(x1 - 5, y1 - 5, 10, 10)
	}

	/**
	 * 箭头
	 * @param {number} x 起点
	 * @param {number} y 起点
	 * @param {number} x1 终点
	 * @param {number} y1 终点
	 */
	drawLineArrow = (x, y, x1, y1) => {
		const lineWidth = 1

		const headlen = (10 * lineWidth) / 2 //自定义箭头线的长度
		const theta = 30 //自定义箭头线与直线的夹角
		let arrowX
		let arrowY //箭头线终点坐标
		// 计算各角度和对应的箭头终点坐标
		const angle = (Math.atan2(y - y1, x - x1) * 180) / Math.PI
		const angle1 = ((angle + theta) * Math.PI) / 180
		const angle2 = ((angle - theta) * Math.PI) / 180

		const topX = headlen * Math.cos(angle1)
		const topY = headlen * Math.sin(angle1)

		const botX = headlen * Math.cos(angle2)
		const botY = headlen * Math.sin(angle2)
		this.ctx.save()

		this.ctx.beginPath()
		this.initStyle()
		this.ctx.lineJoin = 'round'

		//画直线
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(x1, y1)
		this.ctx.stroke()

		//画上边箭头线
		arrowX = x1 + topX
		arrowY = y1 + topY
		this.ctx.moveTo(x1, y1)
		this.ctx.lineTo(arrowX, arrowY)

		// //画下边箭头线
		arrowX = x1 + botX
		arrowY = y1 + botY
		this.ctx.lineTo(arrowX, arrowY)
		this.ctx.closePath()
		this.ctx.stroke()
		this.ctx.fill()
		this.ctx.restore()
	}

	/**
	 * 撤销
	 */
	revoke = () => {
		this.imageData.pop()
		const length = this.imageData.length
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		if (length > 0) {
			this.ctx.putImageData(this.imageData[length - 1], 0, 0, 0, 0, this.canvas.width, this.canvas.height)
		}
	}

	/**
	 * 保存为图片
	 */
	saveToImg = () => {
		const imgBase64 = this.canvas.toDataURL()
		const img = new Image(this.canvas.width, this.canvas.height)
		img.src = imgBase64
		console.log('img :>> ', img);
		imgShow.appendChild(img)
		imgShow.className = 'show'
		// 阻止冒泡事件
		img.addEventListener('click', (ev) => {
			ev.stopPropagation()
		})
	}

	/**
	 * canvas事件
	 * @param {*} e 
	 */
	handleMouseDown = (e) => {
		const x = e.offsetX
		const y = e.offsetY

		/** 绘制自由线条，只需要确定一个起点 */
		if (this.graphType === 'pen') {
			this.ctx.beginPath()
			this.ctx.moveTo(x, y)
		}

		this.canvas.onmousemove = (e) => {
			const w = e.offsetX
			const h = e.offsetY

			/** 除了橡皮擦外，清除绘制过程中产生的轨迹。 原理： 清除画布后，将上一次完成的图像放入 */
			if (this.graphType !== 'eraser') {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
				if (this.imageData.length !== 0) {
					this.ctx.putImageData(this.imageData[this.imageData.length - 1], 0, 0, 0, 0, this.canvas.width, this.canvas.height)
				}
			}

			switch (this.graphType) {
				case 'pen':
					this.drawFreenLine(w, h)
					break
				case 'rect':
					this.drawRect(x, y, w, h)
					break
				case 'circle':
					this.drawCircle(x, y, w, h)
					break
				case 'triangle':
					this.drawTriangle(x, y, w, h)
					break
				case 'line':
					this.drawLine(x, y, w, h)
					break
				case 'lineAllow':
					this.drawLineArrow(x, y, w, h)
					break
				case 'eraser':
					this.eraser(x, y, w, h)
					break
				default:
					break
			}
		}
		document.onmouseup = () => {
			console.log('mouse up');
			this.canvas.onmousemove = null
			document.onmouseup = null
			// 保存当前画布图像信息
			this.imageData.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
		}
	}
}
const canvasObj = new canvasUtil('container')


