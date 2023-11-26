export function useDataClickable(selector: string) {
	let pageButtons = Array.from(document.querySelectorAll(selector))
	for (let b of pageButtons) {
		;(b as HTMLInputElement).style.cursor = 'inherit'
		b.setAttribute('data-clickable', '')
	}
}
