const titleElements = ref<Iterable<HTMLElement>>([])
const tocElements = ref<{ id: string; text: string; tab: number }[]>([])

const enableToc = ref(false)

function setToc(elements: Iterable<HTMLElement>) {
	titleElements.value = elements
	updateToc()
}

function updateToc() {
	tocElements.value = []
	let minTag = '9'
	for (let e of titleElements.value) {
		if (minTag > e.tagName[1]) {
			minTag = e.tagName[1]
		}
	}
	for (let e of titleElements.value) {
		tocElements.value.push({
			id: e.id,
			text: e.innerText,
			tab: parseInt(e.tagName[1]) - parseInt(minTag),
		})
	}
}

function getToc() {
	return tocElements
}

export default () => ({ setToc, getToc, enableToc })
