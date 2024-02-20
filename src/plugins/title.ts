import { router } from './router'

export const localTitle = ref('')

useTitle(() => {
	if (localTitle.value.length > 0) {
		return `${localTitle.value} | ${import.meta.env.VITE_APP_TITLE}`
	}
	return import.meta.env.VITE_APP_TITLE
})
