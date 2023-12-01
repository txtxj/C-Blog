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

<style scoped>
.n-card {
	color: #ffffff;
	border-radius: 15px;
	padding: 20px;
	height: 328px;
}
.n-card {
	transition: background-color 0.3s;
	background-blend-mode: darken;
	background-color: rgba(0, 0, 0, 0.4);
}
.n-card:hover {
	background-blend-mode: darken;
	background-color: rgba(0, 0, 0, 0.25);
}
.n-card-small {
	flex: 1 1 30%;
}
.n-card-medium {
	flex: 1 1 40%;
}
.n-card-large {
	flex: 1 1 50%;
}
.n-card-small,
.n-card-medium,
.n-card-large {
	margin: 20px;
}
.n-card-bg-img {
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	box-shadow: 0 0 5px 1px rgba(74, 47, 3, 0.15);
}

.n-card-tag-hover {
	border-radius: 10px;
	transition:
		background 0.3s,
		outline-color 0.3s;
	outline: solid 5px rgba(245, 158, 11, 0);
}
.n-card-tag-hover:hover {
	color: #fdfdfd;
	outline-color: rgba(245, 158, 11, 0.6);
	background: rgba(245, 158, 11, 0.6);
	text-decoration: none;
}
</style>
