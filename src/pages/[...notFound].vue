<script setup lang="ts">
const router = useRouter()
onMounted(() => {
	useDataClickable('button')
})
</script>

<template>
	<div class="md-blog m-auto">
		<n-space vertical style="max-width: 70ch; margin: auto; padding: 1em 0">
			<h2>404</h2>
			<h2>找不到了捏 QAQ</h2>
			<n-button strong secondary type="warning" @click="$router.go(-1)">
				返回
			</n-button>
		</n-space>
	</div>
</template>

<style scoped></style>
