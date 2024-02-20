<script setup lang="ts">
const { isMobile } = usePhone()
</script>
<template>
	<router-view />
	<cursor-container v-if="!isMobile" />
</template>
