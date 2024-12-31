---
title: "博客搬迁"
date: 2024-02-21T07:07:56+08:00
toc: false
math: md
tags: ["其它"]
cover: https://s2.loli.net/2024/02/21/mI5EjSBTh1ULXzf.jpg
---

从 19 年第一次接触到 Hexo 之后，我就非常喜欢折腾博客。

期间尝试了 Hexo、WordPress、Hogo 等框架，但并没有深入学习，仅仅会改个主题、加点五毛钱特效。

所以，我经常会感到博客的客制化程度不尽人意，但又没有办法。

我一直觉得前端很有趣，但一转眼四年过去了，我却一直没有系统地学习前端。

但好在这几年来打比赛、折腾博客、写爬虫之类的经历让我的前端基础不算差，学习 Vue 需要的前置知识点我差不多都掌握了。

正巧，大四最不缺的就是闲时间了，遂决定把留了四年的前端学习坑补一补，用 Vue 自建了这么一个博客出来。

这个项目参考了 [Q-Blog](https://github.com/liuly0322/Q-Blog)，我觉得它很适合初学者去模仿学习。

<p>
	<em>
		<n-divider title-placement="right" style="font-size: 0.8rem;">
			新建文件夹于 2023 年 11 月 23 日
		</n-divider>
	</em>
</p>

费了老大劲，把 Markdown 内容都改成动态加载的了。完全舍弃 v-html 的好处是可以随意在 Markdown 文件中使用 Vue 组件了

比如：

<n-card style="width: 60%; margin: auto;">
	<n-flex style="display: flex; flex-flow: wrap; justify-content: start; gap: 8px 12px;">
		<n-qr-code error-correction-level="L" :value="text" style="padding: 0; background-color: rgb(255, 255, 255); width: 100px; height: 100px; --n-border-radius: 3px; margin: 12px; max-width: 25%;"/>
		<n-flex style="display: flex; flex-flow: column; justify-content: start; gap: 8px 12px; width: 65%;">
			<h2>二维码生成</h2>
			<n-input maxlength="30" v-model:value="text"></n-input>
		</n-flex>
	</n-flex>
</n-card>

<script setup>
import {ref} from 'vue'
const text=ref('在虚构的故事当中寻求真实感的人脑袋一定有问题')
</script>