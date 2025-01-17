---
title: "GAMES笔记03-光栅化"
date: 2021-12-30T03:13:15+08:00
toc: true
math: mathjax
tags: ["图形学", "笔记"]
cover: https://s2.loli.net/2022/01/05/Lkz73Iro9D158ed.jpg
grow: 
---

在经过模型、视图、投影变换后，待显示的所有物体都处在了一个标准正方体内。

而光栅化的目的，就是把这个标准正方体内的物体转化为一个个像素点显示在屏幕上。

## 视口变换(Viewpoint Transformation)

屏幕中的每个像素点都可以使用一个整数坐标表示，每个像素点的边长为 1 ，

![](https://s2.loli.net/2022/01/04/nAB1h6CV97lvkNF.jpg)

需要注意，坐标 $(x, y)$ 表示的像素点的中心位置实际应为 $(x + 0.5, y + 0.5)$ 

例如，坐标为 $(0, 0)$ 的像素点中心位于 $(0.5, 0.5)$ 。

要将标准正方体变换到屏幕的矩形中，需要

 - 无视 Z 坐标
 - 将坐标变换（缩放）到 $[0, \text{width}] \times [0, \text{height}]$ 的区域中

可以直接写出变换矩阵

$$
\mathbf{M_{viewpoint}} = 
\begin{pmatrix}
\frac{\text{width}}{2} & 0 & 0 & \frac{\text{width}}{2} \\\\
0 & \frac{\text{height}}{2} & 0 & \frac{\text{height}}{2} \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 1
\end{pmatrix}
$$

## 三角形光栅化

由于三角形是最简单的多边形，任意的多边形也都可以拆分为若干个三角形，三角形光栅化也就是多边形光栅化的基础。

考虑任意一个给定三顶点坐标的三角形，该三角形唯一确定。想要在屏幕上显示这个三角形，可以判断屏幕中每个像素点是否在该三角形内部，这种方法被称为采样法。

![](https://s2.loli.net/2022/01/04/OisGBj4mHNIUTX5.jpg)

对于每个像素点，如果该像素点的中央位于三角形内部，那么这个点将被采用；如果位于外部，那么这个点不被采用。

而判断一个像素点的中心是否在三角形内部，可以通过向量的叉积解决。

![](https://s2.loli.net/2022/01/04/yYsmfU59cOPCXTI.jpg)

已知三角形的三顶点坐标 $P_0, P_1, P_2$ ，以及需要判断的像素点中心坐标 $Q$ ，

可以通过计算 $P_0 P_1 \times P_0 Q, P_1 P_2 \times P_1 Q, P_2 P_0 \times P_2 Q$ ，判断三者结果是否同号，若结果同号，则 $Q$ 点一定位于三角形内部，否则 $Q$ 点位于三角形外部。

特殊地，对于恰好落在三角形边界的像素点，可以统一规定采用或不采用，也可以设定更详细的规则来判断。