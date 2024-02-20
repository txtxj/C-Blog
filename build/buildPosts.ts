import fs from 'fs/promises'
import path from 'path'

import { PostSummary } from '~/composables/useSummary'

import fm from 'front-matter'
import MarkdownIt from 'markdown-it'
import { useMarkdownPlugins } from '../presets/plugins/markdown'

const renderer = new MarkdownIt({ html: true })
useMarkdownPlugins(renderer)

const publicPosts = path.join('public', 'dynamic')

const formatDate = (date: Date) => {
	return date
		.toISOString()
		.replace(/T/g, ' ')
		.replace(/\.[\d]{3}Z/, '')
}

async function fileExists(dir: string) {
	return fs
		.access(dir)
		.then(() => true)
		.catch(() => false)
}

async function buildPosts() {
	if (!(await fileExists(publicPosts))) await fs.mkdir(publicPosts)
	const posts: PostSummary[] = []
	const files = await fs.readdir('posts')
	for (const file of files) {
		if (file.endsWith('.md')) {
			const blogName = path.basename(file, '.md')
			const blogPath = path.join('posts', file)
			const content = await fs.readFile(blogPath, { encoding: 'utf-8' })
			const parsed = fm<PostSummary>(content)
			posts.push({
				url: blogName,
				title: parsed.attributes.title,
				date: parsed.attributes.date,
				tags: parsed.attributes.tags,
				toc: parsed.attributes.toc,
				cover: parsed.attributes.cover,
				grow: parsed.attributes.grow,
				content: parsed.body,
			})
		}
	}
	posts.sort((a, b) => b.date.valueOf() - a.date.valueOf())
	posts.forEach((post) => {
		post.date = formatDate(post.date)
	})
	for (const post of posts) {
		const rendered = post.content!
		await fs.writeFile(path.join(publicPosts, `${post.url}.md`), rendered)
	}

	for (const post of posts) delete post.content
	await fs.writeFile(path.join('public', 'summary.json'), JSON.stringify(posts))
}

export default () => ({
	name: 'build-posts',
	async buildStart() {
		await buildPosts()
	},
	async handleHotUpdate(ctx: { file: string; server: any }) {
		if (ctx.file.includes('posts') && !ctx.file.includes('public')) {
			await buildPosts()
			ctx.server.ws.send({
				type: 'custom',
				event: 'posts-build',
			})
		}
	},
	async closeBundle() {
		if (await fileExists(publicPosts))
			await fs.rm(publicPosts, { recursive: true })
	},
})
