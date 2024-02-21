<script setup lang="ts">
import { GithubFilled } from '@ant-design/icons-vue'
import BlogInfo from '~/components/BlogInfo.vue'
const { enableToc } = useToc()
</script>

<template>
	<TransitionGroup name="side-bar" tag="div">
		<Toc v-if="enableToc" key="toc" />
		<BlogInfo key="blogInfo" force-show="true" />
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
	transform: translateY(-100%);
}

.side-bar-leave-active {
	position: absolute;
}
</style>
