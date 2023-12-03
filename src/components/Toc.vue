<script setup lang="ts">
defineProps(['elements'])
</script>

<template>
	<n-card>
		<ul class="toc">
			<li v-for="(item, index) in elements" :id="`toc-${index}`">
				<a :href="`#${item.id}`" data-clickable>
					{{ item.innerText }}
				</a>
			</li>
		</ul>
	</n-card>
</template>

<style scoped>
ul.toc > li > a {
	color: #42b883;
	margin-left: -1.5ch;
	padding-left: 1.5ch;
}
ul.toc > li > a:hover {
	text-decoration: underline;
}
ul.toc > li > a:hover::before {
	content: '>';
	position: relative;
	float: left;
	left: -1.5ch;
	width: 0;
	height: 0;
}
</style>
