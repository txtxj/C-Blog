<script setup lang="ts">
const props = defineProps<{ post: string }>()
const summary = useSummary()
const currPost = computed(
	() =>
		summary.value.find((post) => props.post.includes(post.url)) ?? {
			url: '',
			title: '',
			tags: [],
			date: '',
		},
)

const title = computed(() => {
	return `${currPost.value.title} | Citrineのblog`
})
useTitle(title)

onMounted(() => {
	let scrollbarContents = Array.from(
		document.querySelectorAll('.n-scrollbar-rail'),
	)
	for (let c of scrollbarContents) {
		;(c as HTMLInputElement).addEventListener('mouseenter', (e: Event) => {
			useDataClickable('.n-scrollbar-rail__scrollbar', e.target as ParentNode)
		})
	}
})

onBeforeUnmount(() => {
	if (document) document.title = 'Citrineのblog'
})

const url = computed(() => './' + props.post + '.htm')
const { data } = useFetch(url, { refetch: true })
</script>

<template>
	<PostHeader :post="currPost"></PostHeader>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<div class="md-blog m-auto text-left" v-html="data"></div>
	<PostFooter :post="currPost.url"></PostFooter>
</template>
