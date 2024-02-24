<script setup lang="ts">
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

const { onTouchStart, onTouchEnd, onTouchMove, setPosition, dragBoxPos } =
	useTouchDrag()
onMounted(() => setPosition(80, 40))
</script>

<template>
	<div>
		<n-float-button
			key="-1"
			class="float-button"
			style="z-index: 99"
			menu-trigger="click"
			@touchstart="onTouchStart"
			@touchend="onTouchEnd"
			@touchmove="onTouchMove"
			:bottom="dragBoxPos.y"
			:right="dragBoxPos.x"
		>
			<MenuOutlined />
			<template #menu>
				<n-float-button
					class="float-button"
					v-for="(v, k, i) in mobileNavigation"
					:key="i"
					@click="router.push(k)"
					@touchstart.stop
					@touchend.stop
					@touchmove.stop
					><component :is="v"
				/></n-float-button>
			</template>
		</n-float-button>
	</div>
</template>

<style scoped></style>
