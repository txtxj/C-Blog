import { ComputedRef } from 'vue'
import { PostSummary } from '~/composables/useSummary'

const currentView = ref('/')
const page = ref(1)
const pageMax = ref(1)

const pageDict = new Map<string, number>()

function setCurrentView(view: string, summary: ComputedRef<PostSummary[]>) {
	pageDict.set(currentView.value, page.value)
	currentView.value = view
	// console.log(pageDict)
	if (!pageDict.has(view)) {
		pageDict.set(view, 1)
	}
	page.value = pageDict.get(view)!
	pageMax.value = Math.ceil(summary.value.length / 10)
}

export default () => ({ setCurrentView, page, pageMax })
