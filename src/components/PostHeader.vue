<script setup lang="ts">
import { PostSummary } from '~/composables/useSummary'

const props = defineProps<{
	post: PostSummary
}>()
</script>

<template>
	<div class="md-blog m-auto text-left">
		<h1>{{ post.title }}</h1>
		<p>{{ post.date }}</p>
		<div class="border-b pb-4">
			<n-tag
				v-for="tag in post.tags"
				:key="tag"
				class="mr-2 mb-4 no-cursor"
				type="info"
				round
			>
				<router-link
					:to="`/tags/${encodeURIComponent(tag)}`"
					class="!text-inherit"
					data-clickable
				>
					{{ tag }}
				</router-link>
			</n-tag>
		</div>
	</div>
</template>
<style scoped></style>
