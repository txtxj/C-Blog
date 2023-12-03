<script setup lang="ts">
import { Ref } from 'vue'

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
	if (enableToc) enableToc.value = false
})

const url = computed(() => './' + props.post + '.htm')
const { data } = useFetch(url, { refetch: true })

const enableToc = inject<Ref<Boolean>>('enableToc')
const postKey = inject<Ref<any>>('postKey')

function updateTocParams() {
	if (enableToc && postKey) {
		enableToc.value = !!currPost.value.toc
		postKey.value = Array.from(document.querySelectorAll('.md-blog h2,h3,h4'))
	}
}

onUpdated(updateTocParams)
</script>

<template>
	<PostHeader :post="currPost"></PostHeader>
	<div class="md-blog m-auto text-left" v-html="data"></div>
	<PostFooter :post="currPost.url"></PostFooter>
</template>
