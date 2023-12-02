<script setup lang="ts">
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ComponentPublicInstance } from 'vue'

const menuOptions = [
	{
		label: '主页',
		to: '/',
		match: '/$',
	},
	{
		label: '标签',
		to: '/tags',
		match: '/tags$',
	},
	{
		label: '关于',
		to: '/about',
		match: '/about$',
	},
	{
		label: '友链',
		to: '/link',
		match: '/link$',
	},
]

const router = useRouter()
const routePath = toRef(useRoute(), 'path')

const outLiner = ref<HTMLInputElement | null>(null)
const routerLinks = ref<ComponentPublicInstance[]>([])

watch([routePath, outLiner], () => {
	if (outLiner.value === null) return
	let target = null
	for (let routerLink of routerLinks.value) {
		if (routePath.value.match(routerLink.$el.dataset.matches as string)) {
			target = routerLink.$el
		}
	}
	if (target === null) {
		gsap.to(outLiner.value, {
			duration: 0.2,
			opacity: 0,
		})
		return
	}
	gsap.to(outLiner.value, {
		duration: 0.2,
		left:
			target.offsetLeft -
			outLiner.value.offsetLeft +
			parseInt(outLiner.value.style.left + 0) +
			target.clientWidth -
			parseInt(
				outLiner.value.style.width === ''
					? '' + outLiner.value.clientWidth
					: outLiner.value.style.width,
			),
		width: target.clientWidth,
		opacity: 1,
		ease: 'back.out',
	})
})
</script>

<template>
	<n-card
		class="w-auto m-1 rounded-4 sticky top-1"
		style="--n-color-embedded: rgba(255, 113, 0, 0.02)"
		content-style="display:flex;align-items:center;justify-content:space-between;"
		tag="div"
	>
		<div class="flex items-center" @click="router.push('/')" data-clickable>
			<img
				class="rounded-full"
				src="https://avatars.githubusercontent.com/u/47293990?s=100"
				alt="Citrine"
				width="48"
			/>
			<span class="pl-5 text-2xl">Citrine</span>
			<n-divider
				vertical
				class="py-5"
				style="background-color: rgba(243, 169, 184, 0.5)"
			/>
			<Typewriter
				class="mt-1 pl-2 text-0.9em text-gray"
				prefix="A"
				:strings="[' Programmer', 'n Engineer', ' Gamer', 'n ACG Lover']"
			></Typewriter>
		</div>
		<div class="inline-flex">
			<p
				class="relative px-5 rounded-lg outline outline-amber-200 outline-2 bg-amber-200 pointer-events-none"
				style="z-index: -1"
				ref="outLiner"
			></p>
			<RouterLink
				v-for="option in menuOptions"
				:key="option.to"
				:to="option.to"
				:data-matches="option.match"
				class="block mx-3 px-2 text-1.25em items-center"
				ref="routerLinks"
				data-clickable
			>
				{{ option.label }}
			</RouterLink>
		</div>
	</n-card>
</template>

<style scoped></style>
