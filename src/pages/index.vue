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
	<template v-for="post in posts" :key="post">
		<router-link
			:class="{
				'n-card-small': post.summary.size === 'small',
				'n-card-medium': post.summary.size === 'medium',
				'n-card-large': post.summary.size === 'large',
			}"
			:to="`/posts/${encodeURIComponent(post.summary.url)}`"
			data-clickable
		>
			<n-card
				class="px-2 n-card-bg-img text-left"
				header-style="font-size:2em; margin-top:1em;--n-title-text-color: #ffffff"
				footer-style="text-align: left"
				:style="{ 'background-image': post.summary.img }"
				hoverable
			>
				<template #header>
					{{ post.summary.title }}
				</template>
				<template #default>
					{{ post.summary.date }}
				</template>
				<template #footer>
					<span
						v-for="tag in post.summary.tags"
						:key="tag"
						class="mr-2 text-slate-200 n-card-tag-hover"
						data-clickable
					>
						<router-link :to="`/tags/${encodeURIComponent(tag)}`"
							>#{{ tag }}</router-link
						>
					</span>
				</template>
			</n-card>
		</router-link>
	</template>
	<div class="my-10 inline-block w-100vw flex" style="justify-content: center">
		<n-pagination v-model:page="page" :page-count="pageMax" />
	</div>
</template>

<style>
.n-layout-content .n-card {
	color: #ffffff;
	border-radius: 15px;
	padding: 20px;
	height: 328px;
}
.n-layout-content .n-card {
	background-blend-mode: darken;
	background-color: rgba(0, 0, 0, 0.4);
}
.n-layout-content .n-card:hover {
	background-blend-mode: darken;
	background-color: rgba(0, 0, 0, 0.25);
}
.n-layout-content a.n-card-small {
	flex: 1 1 33%;
}
.n-layout-content a.n-card-medium {
	flex: 1 1 50%;
}
.n-layout-content a.n-card-large {
	flex: 1 1 66%;
}
.n-layout-content a.n-card-small,
.n-layout-content a.n-card-medium,
.n-layout-content a.n-card-large {
	margin: 20px;
}
.n-layout-content .n-card.n-card-bg-img {
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	box-shadow: 0 0 5px 1px rgba(74, 47, 3, 0.15);
}

.n-layout-content .n-card-tag-hover {
	border-radius: 10px;
	transition:
		background 0.3s,
		outline-color 0.3s;
	outline: solid 5px rgba(245, 158, 11, 0);
}
.n-layout-content .n-card-tag-hover:hover {
	outline-color: rgba(245, 158, 11, 0.6);
	color: #fdfdfd;
	background: rgba(245, 158, 11, 0.6);
	text-decoration: none;
}
</style>
