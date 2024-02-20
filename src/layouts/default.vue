<script setup lang="ts">
import type { LayoutInst } from 'naive-ui'

const contentRef = ref<LayoutInst | null>(null)
const routePath = toRef(useRoute(), 'path')
const { page, pageMax } = usePage()
const { isMobile } = usePhone()

watch([routePath, page], () => {
	contentRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(pageMax, () => nextTick(() => useDataClickable('.n-pagination-item')))

onMounted(() => useDataClickable('.n-layout-toggle-button'))
const mainStyle = computed(() => {
	return (
		(isMobile.value ? 'mt-2 ' : 'mt-10 ') +
		'pb-10 text-center text-gray-700 dark:text-gray-200'
	)
})
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
			content-style="padding: 0 24px;min-width: 280px;overflow: hidden;"
		>
			<main :class="mainStyle">
				<router-view v-slot="{ Component }">
					<transition name="fade" mode="out-in">
						<component :is="Component" />
					</transition>
				</router-view>
			</main>
		</n-layout-content>
		<n-layout-sider
			v-if="!isMobile"
			content-style="padding: 24px;"
			:collapsed-width="14"
			:width="320"
			:native-scrollbar="false"
			show-trigger="arrow-circle"
			bordered
		>
			<SideBar />
		</n-layout-sider>
		<MobileBar v-if="isMobile"></MobileBar>
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
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
