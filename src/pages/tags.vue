<script setup lang="ts">
import { onMounted } from 'vue'
import { ECharts } from 'echarts'

const { initBubble, resizeBubble } = useBubble()

let dataIndex = ['label', 'amount']
let data = [
	{ label: '可乐', amount: 100 },
	{ label: '雪碧', amount: 70 },
	{ label: '土豆', amount: 30 },
	{ label: '饼干', amount: 50 },
]

const bubbleContainer = ref<HTMLObjectElement | null>()
const bubbleElement = ref<HTMLDivElement | null>()
const bubble = ref<ECharts | null>(null)

function resizeThisBubble() {
	resizeBubble(bubble.value as ECharts)
}

onMounted(() => {
	bubble.value = initBubble(
		data as never[],
		dataIndex as never[],
		bubbleElement,
	)
	bubbleContainer.value!.contentDocument!.defaultView!.addEventListener(
		'resize',
		resizeThisBubble,
	)
})

onBeforeUnmount(() => {
	bubbleContainer.value!.contentDocument!.defaultView!.removeEventListener(
		'resize',
		resizeThisBubble,
	)
})
</script>

<template>
	<n-card content-style="padding: 0;" style="height: 600px">
		<object
			class="bubbleContainer"
			ref="bubbleContainer"
			type="text/html"
			aria-hidden="true"
			data="about:blank"
		/>
		<div
			ref="bubbleElement"
			class="no-cursor"
			:style="{ height: '100%', width: '100%' }"
		/>
	</n-card>
</template>

<style scoped>
.bubbleContainer {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: none;
	padding: 0;
	margin: 0;
	opacity: 0;
	z-index: -1000;
	pointer-events: none;
}
.no-cursor >>> div {
	color: #42b883;
	cursor:
		url('../assets/cursor.png') 3 3,
		default !important;
}
</style>
