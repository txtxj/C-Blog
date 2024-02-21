import { ref } from 'vue'

// ref: https://juejin.cn/post/7145519231562416165
const dragPos = {
	hasMoved: false,
	x: 0,
	y: 0,
	startX: 0,
	startY: 0,
	endX: 0,
	endY: 0,
}
const dragBoxPos = ref({ x: 0, y: 0 })

const onTouchStart = (e: TouchEvent) => {
	console.log('onTouchStart')
	dragPos.startX = e.touches[0].pageX
	dragPos.startY = e.touches[0].pageY
	dragPos.hasMoved = false
}

const onTouchEnd = (e: TouchEvent) => {
	console.log('onTouchEnd')
	if (!dragPos.hasMoved) return
	console.log('dragPos.hasMoved')
	dragPos.startX = 0
	dragPos.startY = 0
	dragPos.hasMoved = false
	setPosition(dragPos.endX, dragPos.endY)
}

const onTouchMove = (e: TouchEvent) => {
	if (e.touches.length <= 0) return
	const offsetX = e.touches[0].pageX - dragPos.startX,
		offsetY = e.touches[0].pageY - dragPos.startY
	let x = Math.floor(dragPos.x - offsetX),
		y = Math.floor(dragPos.y - offsetY)
	dragBoxPos.value.x = x
	dragBoxPos.value.y = y
	dragPos.endX = x
	dragPos.endY = y
	dragPos.hasMoved = true
	e.preventDefault()
}

const setPosition = (dragX: number, dragY: number) => {
	dragPos.x = dragX
	dragPos.y = dragY
	dragBoxPos.value.x = dragX
	dragBoxPos.value.y = dragY
}

export default () => ({
	onTouchStart,
	onTouchEnd,
	onTouchMove,
	setPosition,
	dragBoxPos,
})
