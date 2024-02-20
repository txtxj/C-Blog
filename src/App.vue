<script setup lang="ts">
const { isMobile } = usePhone()
</script>
<template>
	<router-view :key="$route.path" />
	<cursor-container v-if="!isMobile" />
</template>
