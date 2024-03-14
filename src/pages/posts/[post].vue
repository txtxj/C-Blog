<script setup lang="ts">
import { localTitle } from '~/plugins/title'

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

const { setToc, enableToc } = useToc()

onBeforeUnmount(() => {
	enableToc.value = false
	localTitle.value = ''
})

function updateArticle() {
	localTitle.value = currPost.value.title
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
import BlogInfo from '~/components/BlogInfo.vue'

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

import NotFound from '~/pages/[...notFound].vue'

const notFound = ref(false)
const modules = import.meta.glob('~/posts/*.md')
watch(
	() => props.post,
	() => {
		notFound.value = modules[`/src/posts/${props.post}.md`] === undefined
		if (!notFound.value) {
			Article = defineAsyncComponent(
				modules[`/src/posts/${props.post}.md`] as any,
			)
		}
	},
	{ immediate: true },
)

function getRand(min: number, max: number): number {
	return min + Math.round(Math.random() * (max - min))
}

const skelenton = ref<{ repeat: number; width: string }[]>([])

onMounted(() => {
	skelenton.value = []
	let length = getRand(4, 8)
	for (let i = 0; i < length; i++) {
		skelenton.value.push({
			repeat: getRand(1, 3),
			width: 'width: ' + getRand(20, 80) + '%',
		})
	}
})
</script>

<template>
	<div>
		<NotFound v-if="notFound" />
		<div v-else class="md-blog m-auto text-left">
			<PostHeader :post="currPost"></PostHeader>
			<Suspense @resolve="updateArticle">
				<component :is="Article"></component>
				<template #fallback>
					<n-thing v-for="k in skelenton">
						<n-skeleton text :repeat="k.repeat" />
						<n-skeleton text :style="k.width" />
					</n-thing>
				</template>
			</Suspense>
			<!--		<div class="md-blog m-auto text-left" v-html="data"></div>-->
			<PostFooter :post="currPost.url"></PostFooter>
		</div>
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
