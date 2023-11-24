import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
	const x = ref(0)
	const y = ref(0)
	const hover = ref(false)
	const click = ref(false)

	function updatePos(event: MouseEvent) {
		hover.value =
			(event.target as HTMLInputElement)
				.closest('[data-clickable]')
				?.hasAttribute('data-clickable') ?? false

		x.value = event.pageX
		y.value = event.pageY
	}

	function updateClick() {
		click.value = true
	}

	function consumeClick() {
		click.value = false
	}

	onMounted(() => window.addEventListener('mousemove', updatePos))
	onUnmounted(() => window.removeEventListener('mousemove', updatePos))
	onMounted(() => window.addEventListener('click', updateClick))
	onUnmounted(() => window.removeEventListener('click', updateClick))

	return { x, y, hover, click, consumeClick }
}
