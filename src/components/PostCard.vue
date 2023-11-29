<script setup lang="ts">
defineProps(['post'])
</script>

<template>
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

<style scoped></style>
