<script setup lang="ts">
import { Ref } from 'vue'

const enableToc = inject<Ref<Boolean>>('enableToc')
const props = defineProps<{ post: string }>()
const summary = useSummary()
const currPost = computed(
	() =>
		summary.value.find((post) => props.post.includes(post.url)) ?? {
			url: '',
			title: '',
			tags: [],
			date: '',
			toc: false,
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

onUpdated(() => {
	console.log(currPost.value.title + '  ' + currPost.value.toc)
})

const url = computed(() => './' + props.post + '.htm')
const { data } = useFetch(url, { refetch: true })

watch(currPost, () => {
	enableToc!.value = !!currPost.value.toc
})
</script>

<template>
	<PostHeader :post="currPost"></PostHeader>
	<div class="md-blog m-auto text-left" v-html="data"></div>
	<PostFooter :post="currPost.url"></PostFooter>
</template>
