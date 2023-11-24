<script setup lang="ts">
import { computed } from 'vue'
import gsap from 'gsap'

const cursorEffect = ref<HTMLInputElement | null>(null)
const { x, y, hover, click, consumeClick } = useMouse()
const cursorOuterPos = ref<{ left: number; top: number }>({ left: 0, top: 0 })
const cursorOuterPosPx = computed(() => ({
	left: cursorOuterPos.value.left + 'px',
	top: cursorOuterPos.value.top + 'px',
}))

watch([x, y], () => {
	gsap.to(cursorOuterPos.value, {
		left: x.value,
		top: y.value,
		duration: 0.25,
		ease: 'power1.out',
	})
})

const cursorOuterActive = {
	'background-color': 'rgba(245, 158, 11, 25%)',
	height: '24px',
	width: '24px',
}

watch(click, () => {
	if (!click.value || cursorEffect.value === null) return
	let target = cursorEffect.value as HTMLInputElement
	target.style.opacity = '1'
	target.style.width = '24px'
	target.style.height = '24px'
	target.style.left = x.value + 'px'
	target.style.top = y.value + 'px'
	gsap.to(target, {
		opacity: 0,
		width: 96,
		height: 96,
		duration: 0.4,
		onComplete: consumeClick,
	})
})
</script>

<template>
	<div class="cursor-container" style="opacity: 1">
		<div
			class="cursor-outer"
			style="transform: translate3d(-50%, -50%, 0px)"
			:style="[cursorOuterPosPx, hover ? cursorOuterActive : null]"
		/>
		<div
			class="cursor-effect"
			style="transform: translate3d(-50%, -50%, 0px) scale(1); opacity: 0"
			ref="cursorEffect"
		></div>
	</div>
</template>

<style scoped>
.cursor-container {
	position: absolute;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.3s;
}
.cursor-container .cursor-outer {
	z-index: 999999;
	position: fixed;
	border-radius: 50%;
	width: 48px;
	height: 48px;
	border: 1px solid rgba(245, 158, 11, 60%);
	transition:
		background-color 0.3s,
		width 0.3s,
		height 0.3s;
	pointer-events: none;
}
.cursor-container .cursor-effect {
	opacity: 0;
	z-index: 999998;
	position: fixed;
	border-radius: 50%;
	width: 24px;
	height: 24px;
	border: 2px solid rgb(245, 158, 11);
}
</style>
