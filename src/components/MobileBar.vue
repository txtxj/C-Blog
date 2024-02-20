<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(true)
function onClick() {
	isOpen.value = !isOpen.value
	console.log(isOpen.value)
}
</script>

<template>
	<div>
		<!--    TODO-->
	</div>
</template>
