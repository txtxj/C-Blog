<script setup lang="ts">
import type { LayoutInst } from 'naive-ui'
import { provide, Ref } from 'vue'

const enableToc = ref<Boolean>(false)
provide<Ref<Boolean>>('enableToc', enableToc)

const contentRef = ref<LayoutInst | null>(null)
const routePath = toRef(useRoute(), 'path')
const { page } = usePage()
watch([routePath, page], () => {
	contentRef.value?.scrollTo(0, 0)
})

onMounted(() => useDataClickable('.n-layout-toggle-button'))
</script>

<template>
	<Header />
	<n-layout
		style="height: calc(100vh - 110px)"
		has-sider
		sider-placement="right"
	>
		<n-layout-content
			ref="contentRef"
			:native-scrollbar="false"
			content-style="padding: 0 24px;min-width: 600px;overflow: hidden;"
		>
			<main class="mt-10 pb-10 text-center text-gray-700 dark:text-gray-200">
				<RouterView />
			</main>
		</n-layout-content>
		<n-layout-sider
			content-style="padding: 24px;"
			:collapsed-width="14"
			:width="320"
			:native-scrollbar="false"
			show-trigger="arrow-circle"
			bordered
		>
			<SideBar :enable-toc="enableToc" />
		</n-layout-sider>
	</n-layout>
</template>

<style>
.n-scrollbar-rail > .n-scrollbar-rail__scrollbar {
	background: linear-gradient(
		rgba(204, 255, 255, 0.8),
		rgba(255, 255, 204, 0.8),
		rgba(255, 204, 255, 0.8)
	);
}
</style>
