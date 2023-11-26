export function useDataClickable(
	selector: string,
	element: ParentNode = document,
) {
	let buttons = Array.from(element.querySelectorAll(selector))
	for (let b of buttons) {
		;(b as HTMLInputElement).style.cursor = 'inherit'
		b.setAttribute('data-clickable', '')
	}
}
