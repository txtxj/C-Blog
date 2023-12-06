<script setup lang="ts">
const { getToc } = useToc()
const elem = getToc()
</script>

<template>
	<n-card>
		<TransitionGroup name="list" tag="ul" class="toc">
			<li
				v-for="(item, index) in elem"
				:id="`toc-${index}`"
				:key="`toc-${index}`"
			>
				<a :href="`#${item.id}`" data-clickable>
					{{ item }}
				</a>
			</li>
		</TransitionGroup>
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

.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
.list-leave-active {
	position: absolute;
}
</style>
