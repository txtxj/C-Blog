const { data } = useFetch('/summary.json').json()
export interface PostSummary {
	title: string
	date: any
	tags: string[]
	url: string
	toc?: Boolean
	cover?: string
	grow?: string
	content?: string
}

const summary = computed(() => (data.value ?? []) as PostSummary[])
export default () => summary
