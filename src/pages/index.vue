<script setup lang="ts">
const summary = useSummary()
const { setCurrentView, page, pageMax } = usePage()
const posts = computed(() => {
	const currSummary = summary.value
	return currSummary
		.map((detail: any, i: number) => ({
			detail,
			summary: summary.value[i],
		}))
		.slice((page.value - 1) * 8, page.value * 8)
})

onMounted(() => {
	setCurrentView('/', summary)
	useDataClickable('.n-pagination-item, .n-scrollbar-rail__scrollbar')
})

onMounted(() => {
	let scrollbarContents = Array.from(document.querySelectorAll('.n-scrollbar'))
	for (let c of scrollbarContents) {
		;(c as HTMLInputElement).addEventListener('mouseenter', (e: Event) => {
			useDataClickable('.n-scrollbar-rail__scrollbar', e.target as ParentNode)
		})
	}
})
const { isMobile } = usePhone()
const gridStyle = computed(() => {
	return isMobile.value
		? ''
		: 'display: flex; flex-direction: row; flex-wrap: wrap'
})
const paginationStyle = computed(() => {
	return (isMobile.value ? '' : 'w-100vw ') + 'my-10 flex'
})
</script>

<template>
	<div :style="gridStyle">
		<PostCard v-for="post in posts" :key="post.summary.url" :post="post" />
		<div :class="paginationStyle" style="justify-content: center">
			<n-pagination v-model:page="page" :page-count="pageMax" />
		</div>
	</div>
</template>

<style scoped></style>
