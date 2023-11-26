<script setup lang="ts">
import TypeIt from 'typeit'

const text = ref(null)
const props = defineProps(['prefix', 'strings'])
onMounted(() => {
	new TypeIt(text.value, {
		cursorChar: "<span class='cursorChar'>|<span>",
		speed: 150,
		cursor: true,
		breakLines: false,
		loop: true,
		startDelete: false,
		strings: props.strings,
		startDelay: 1500,
		nextStringDelay: 1500,
	}).go()
})
</script>

<template>
	<p>
		<span>{{ props.prefix }}</span>
		<span ref="text"></span>
	</p>
</template>

<style scoped>
.cursorChar {
	display: inline-block;
	margin-left: 2px;
}
</style>
