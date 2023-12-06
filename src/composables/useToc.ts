const titleElements = ref<Iterable<Element>>([])

const enableToc = ref(false)

function setToc(elements: Iterable<Element>) {
	titleElements.value = elements
}

function getToc() {
	let minTag = 'H8'
	for (let e of titleElements.value) {
		if (minTag < e.tagName) {
			minTag = e.tagName
		}
	}
	return titleElements
}

export default () => ({ setToc, getToc, enableToc })
