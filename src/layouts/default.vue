<script setup lang="ts">
import type { LayoutInst } from 'naive-ui'

const contentRef = ref<LayoutInst | null>(null)
const routePath = toRef(useRoute(), 'path')
const { page } = usePage()
watch([routePath, page], () => {
	contentRef.value?.scrollTo(0, 0)
})
</script>

<template>
	<Header />
	<RouterView></RouterView>
</template>

<style></style>
