<script setup lang="ts">
// trick：一个用 map 计数的 util 函数
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const counter = <T extends unknown>(arr: Array<T>) =>
	arr.reduce(
		(acc: Map<T, number>, e: T) => acc.set(e, (acc.get(e) || 0) + 1),
		new Map(),
	)

const _summary = useSummary()
const summary = _summary.value.map((post) => post.tags).flat()
const data = [...counter(summary).entries()]
	.sort((tag_a, tag_b) => tag_b[1] - tag_a[1])
	.map(([s, n]) => ({ label: s, amount: n }))

import { onMounted } from 'vue'
import { ECharts } from 'echarts'

const { initBubble, resizeBubble } = useBubble()

const bubbleContainer = ref<HTMLObjectElement | null>()
const bubbleElement = ref<HTMLDivElement | null>()
const bubble = ref<ECharts | null>(null)

function resizeThisBubble() {
	resizeBubble(bubble.value as ECharts)
}

onMounted(() => {
	bubble.value = initBubble(
		data as never[],
		['label', 'amount'] as never[],
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
