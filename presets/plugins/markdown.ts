import MarkdownIt, { Token } from 'markdown-it'
import MDPrism from 'markdown-it-prism'
import katex from 'katex'
import MDAnchor from 'markdown-it-anchor'
// @ts-ignore
import MDIterator from 'markdown-it-for-inline'
// @ts-ignore
import MDTexMath from 'markdown-it-texmath'

export const markdownWrapperClasses = 'md-blog m-auto text-left'

export function useMarkdownPlugins(md: MarkdownIt) {
	md.use(
		MDIterator,
		'addDataClickable',
		'link_open',
		function (tokens: Token[], idx: number) {
			tokens[idx].attrSet('data-clickable', '')
		},
	)
		.use(MDPrism)
		.use(MDTexMath, {
			engine: katex,
			delimiters: 'dollars',
			katexOptions: { strict: false },
		})
		.use(MDAnchor, {
			permalinkBefore: true,
			permalink: MDAnchor.permalink.headerLink({
				safariReaderFix: true,
				renderAttrs: () => ({ 'data-clickable': '' }),
			}),
		})
	md.renderer.rules.image = (tokens, idx, options, env, self) => {
		const srcItem = tokens[idx].attrs!.find((item) => {
			return item[0] === 'src'
		})
		const src = srcItem![1]
		const alt = tokens[idx].content
		return `<n-image src="${src}" alt="${alt}" show-toolbar-tooltip />`
	}
}
