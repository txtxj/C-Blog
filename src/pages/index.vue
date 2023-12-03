<script setup lang="ts">
const summary = useSummary()
const { page, pageMax } = usePage()
const posts = computed(() => {
	const currSummary = summary.value
	return currSummary
		.map((detail: any, i: number) => ({
			detail,
			summary: summary.value[i],
		}))
		.slice((page.value - 1) * 8, page.value * 8)
})

onMounted(() =>
	useDataClickable('.n-pagination-item, .n-scrollbar-rail__scrollbar'),
)

onMounted(() => {
	let scrollbarContents = Array.from(document.querySelectorAll('.n-scrollbar'))
	for (let c of scrollbarContents) {
		;(c as HTMLInputElement).addEventListener('mouseenter', (e: Event) => {
			useDataClickable('.n-scrollbar-rail__scrollbar', e.target as ParentNode)
		})
	}
})
</script>

<template>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap">
		<PostCard v-for="post in posts" :key="post.summary.url" :post="post" />
		<div class="my-10 w-100vw flex" style="justify-content: center">
			<n-pagination v-model:page="page" :page-count="pageMax" />
		</div>
	</div>
</template>

<style scoped></style>
