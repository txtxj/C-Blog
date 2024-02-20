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

// const url = computed(() => './' + props.post + '.htm')
// const { data } = useFetch(url, { refetch: true })

const { setToc, enableToc } = useToc()

function updateArticle() {
	enableToc.value = !!currPost.value.toc
	if (enableToc.value) {
		setToc(Array.from(document.querySelectorAll('.md-blog h2,h3,h4')))
	}
	let pictures = useDataClickable('.n-image > img')
	for (let p of pictures) {
		;(p as HTMLElement).addEventListener('click', () =>
			useDataClickable('.n-image-preview-toolbar .n-base-icon'),
		)
	}
}

import { defineAsyncComponent } from 'vue'

let Article: any

// watch(
// 	() => props.post,
// 	() => {
// 		Article = defineAsyncComponent(
// 			() =>
// 				// import(`/dynamic/${props.post}.md`, { with: { type: 'javascript' } }),
// 				import('~/../public/dynamic/test.md'),
// 		)
// 	},
// 	{ immediate: true },
// )

const modules = import.meta.glob('~/../public/dynamic/*.md')
watch(
	() => props.post,
	() => {
		if (modules[`/public/dynamic/${props.post}.md`] !== undefined) {
			Article = defineAsyncComponent(
				modules[`/public/dynamic/${props.post}.md`] as any,
			)
		} else {
			const router = useRouter()
			router.replace('/notFound')
		}
	},
	{ immediate: true },
)
</script>

<template>
	<div class="md-blog m-auto text-left">
		<PostHeader :post="currPost"></PostHeader>
		<Suspense @resolve="updateArticle">
			<component :is="Article"></component>
		</Suspense>
		<!--		<div class="md-blog m-auto text-left" v-html="data"></div>-->
		<PostFooter :post="currPost.url"></PostFooter>
	</div>
</template>

<style>
.n-image {
	display: inherit !important;
	cursor: inherit !important;
}
.n-image-preview-toolbar .n-base-icon {
	box-sizing: content-box;
	cursor: inherit !important;
}
.n-image-preview {
	cursor: inherit !important;
}
</style>
