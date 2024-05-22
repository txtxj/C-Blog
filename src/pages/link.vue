<script setup lang="ts">
interface Friend {
	name: string
	link: string
	intro: string
	avatar: string
}

import _friends from '../../assets/friends.json'
const friends: Friend[] = _friends
const content = ref()

function imgError(params: any) {
	params.target.style.visibility = 'hidden'
	console.log(params.target.style.visibility)
}

onMounted(() => {
	useDataClickable('.n-card', content.value)
})
</script>

<template>
	<div class="md-blog m-auto text-left">
		<n-divider title-placement="left">友情链接</n-divider>
		<div class="overflow-hidden flex flex-wrap" ref="content">
			<template v-for="friend in friends" :key="friend.name">
				<a
					:href="friend.link"
					target="_blank"
					class="flex-auto text-left m-2.5"
					style="text-decoration: none"
				>
					<n-card content-style="display: flex" hoverable>
						<img
							:src="friend.avatar"
							:alt="friend.name"
							height="48"
							width="48"
							@error="imgError"
						/>
						<div class="flex flex-col">
							<b>{{ friend.name }}</b>
							{{ friend.intro }}
						</div>
					</n-card>
				</a>
			</template>
		</div>
	</div>
</template>

<style scoped>
img {
	margin: 0 12px 0 0;
	border-radius: 9999px;
}
</style>
