<script setup lang="ts">
defineProps(['forceShow'])
import { GithubFilled } from '@ant-design/icons-vue'
const { isMobile } = usePhone()
</script>

<template>
	<n-card class="mt-6 text-center" v-if="forceShow || isMobile">
		<a
			class="m-1 inline-block"
			href="https://github.com/txtxj"
			target="_blank"
			data-clickable
		>
			<GithubFilled style="font-size: xx-large" />
		</a>
		<p class="mt-3">Copyright © 2023-2024 Citrine</p>
		<p>
			License:
			<a
				href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
				style="color: #258fb8"
				target="_blank"
				data-clickable
				>CC-BY-NC-SA 4.0</a
			>
		</p>
		<p>
			Powered by
			<a
				href="https://github.com/txtxj"
				style="color: #258fb8"
				target="_blank"
				data-clickable
				>C-Blog</a
			>
		</p>
	</n-card>
</template>

<style scoped>
a {
	--n-text-color: inherit;
	color: var(--n-text-color);
}
p {
	margin: 1px;
}
</style>
