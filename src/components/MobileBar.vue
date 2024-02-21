<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(false)
const handleClick = () => (isOpen.value = !isOpen.value)

import {
	MenuOutlined,
	HomeOutlined,
	TagsOutlined,
	QuestionCircleOutlined,
	TeamOutlined,
} from '@ant-design/icons-vue'

const mobileNavigation = {
	'/': HomeOutlined,
	'/tags': TagsOutlined,
	'/about': QuestionCircleOutlined,
	'/link': TeamOutlined,
}
const router = useRouter()
console.log(mobileNavigation)
</script>

<template>
	<transition-group name="fade" tag="div" class="button-group">
		<n-button class="float-button" style="z-index: 11" @click="handleClick">
			<template #icon>
				<MenuOutlined />
			</template>
		</n-button>
		<n-button
			class="float-button"
			v-for="(v, k, i) in mobileNavigation"
			v-if="isOpen"
			:key="i"
			@click="router.push(k)"
			><template #icon> <component :is="v" /> </template
		></n-button>
	</transition-group>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.button-group {
	position: fixed;
	z-index: 10;
	bottom: 40px;
	right: calc(40px);
	display: flex;
	flex-direction: column-reverse;
	row-gap: 8px;
}
.float-button {
	width: 44px;
	height: 44px;
	font-size: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	box-shadow: rgba(0, 0, 0, 0.12) 0 2px 8px 0;
}
</style>
