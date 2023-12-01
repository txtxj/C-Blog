<script setup lang="ts">
const { data } = useFetch('/page.json').json()
const summary = useSummary()
const { page, pageMax } = usePage()
const posts = computed(() => {
	const currSummary = data.value ?? Array(summary.value.length).fill('')
	return currSummary
		.map((detail: string, i: number) => ({
			detail,
			summary: summary.value[i],
		}))
		.slice((page.value - 1) * 10, page.value * 10)
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
	<PostCard v-for="post in posts" :key="post" :post="post" />
	<div class="my-10 w-100vw flex" style="justify-content: center">
		<n-pagination v-model:page="page" :page-count="pageMax" />
	</div>
</template>

<style scoped></style>
