<script setup lang="ts">
import TypeIt from 'typeit'

const text = ref(null)
onMounted(() => {
	new TypeIt(text.value, {
		cursorChar: "<span class='cursorChar'>|<span>", //用于光标的字符。HTML也可以
		speed: 150,
		cursor: true, //在字符串末尾显示闪烁的光标
		breakLines: false, // 控制是将多个字符串打印在彼此之上，还是删除这些字符串并相互替换
		loop: true, //是否循环
		startDelete: false,
	})
		.type(' Programmer')
		.pause(1000)
		.delete(10)
		.type('Gamer')
		.pause(1000)
		.delete(6)
		.type('n ACG Lover')
		.pause(1000)
		.delete(11)
		.go()
})
</script>

<template>
	<p>
		<span><slot></slot></span>
		<span ref="text"></span>
	</p>
</template>

<style scoped>
.cursorChar {
	display: inline-block;
	margin-left: 2px;
}
</style>
