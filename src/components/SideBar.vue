<script setup lang="ts">
import { GithubFilled, CheckOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
const props = defineProps(['enableToc', 'postKey'])

const innerEnableToc = computed(() => !!props.enableToc)
const tocElems = computed(() => props.postKey)
</script>

<template>
	<TransitionGroup name="side-bar" tag="div">
		<Toc v-if="innerEnableToc" key="toc" :elements="tocElems" />
		<n-card class="mt-6 text-center" key="blogInfo">
			<a
				class="m-1 inline-block"
				href="https://github.com/txtxj"
				target="_blank"
				data-clickable
			>
				<GithubFilled style="font-size: xx-large" />
			</a>
			<p class="mt-3">Copyright © 2023 Citrine</p>
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
					>My-Blog</a
				>
			</p>
		</n-card>
	</TransitionGroup>
</template>

<style scoped>
.side-bar-move,
.side-bar-enter-active,
.side-bar-leave-active {
	transition: all 0.5s ease;
}

.side-bar-enter-from,
.side-bar-leave-to {
	opacity: 0;
	transform: translateY(-150%);
}

.side-bar-leave-active {
	position: absolute;
}
</style>
