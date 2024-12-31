---
title: "GAMES笔记01-线性代数基础"
date: 2021-12-22T16:01:30+08:00
toc: true
math: mathjax
tags: ["图形学", "笔记"]
cover: "https://s2.loli.net/2021/12/22/COkFWMJe9YnTPaZ.jpg"
grow: 
---

## 2D 线性变换

### 缩放(Scale)

$$
\mathbf{scale}(s_x, s_y) = 
\begin{pmatrix}
s_x & 0         \\\\
0 & s_y         \\\\
\end{pmatrix}
$$
$$x' = s_x x$$
$$y' = s_y y$$

![](https://s2.loli.net/2021/12/22/TVHI19lXyZgW3tA.jpg)

如上图所示，

$$
\begin{pmatrix}
x'				\\\\
y'
\end{pmatrix} = 
\begin{pmatrix}
0.5 & 0			\\\\
0 & 1			\\\\
\end{pmatrix}
\begin{pmatrix}
x				\\\\
y
\end{pmatrix}
$$

另外，关于坐标轴的反射，也是一种特殊的缩放。

![](https://s2.loli.net/2021/12/22/W5yrbQIkLcVji4M.jpg)

如上图所示，

$$
\begin{pmatrix}
x'				\\\\
y'
\end{pmatrix} = 
\begin{pmatrix}
-1 & 0			\\\\
0 & 1			\\\\
\end{pmatrix}
\begin{pmatrix}
x				\\\\
y
\end{pmatrix}
$$

### 剪切(Shear)

剪切就像是固定住图形的一边，通过拖拽图形的另外一边得到的变换。

$$
\mathbf{shear}_x(s) = 
\begin{pmatrix}
1 & s	        \\\\
0 & 1           \\\\
\end{pmatrix}, 
\begin{aligned}
x' &= x + s y	\\\\
y' &= y
\end{aligned}
$$
$$
\mathbf{shear}_y(s) = 
\begin{pmatrix}
1 & 0	        \\\\
s & 1           \\\\
\end{pmatrix}, 
\begin{aligned}
x' &= x 		\\\\
y' &= s x + y
\end{aligned}
$$

![](https://s2.loli.net/2021/12/22/hJdbpVPkT1SjaCX.jpg)

如上图所示，

$$
\begin{pmatrix}
x'				\\\\
y'
\end{pmatrix} = 
\begin{pmatrix}
1 & a			\\\\
0 & 1			\\\\
\end{pmatrix}
\begin{pmatrix}
x				\\\\
y
\end{pmatrix}
$$

缩放后得到
$$
\begin{aligned}
x' &= x + a y	\\\\
y' &= y
\end{aligned}
$$

### 旋转(Rotate)

2D 旋转通常将逆时针方向设为正方向。

![](https://s2.loli.net/2021/12/22/uTMO6DxSrldejPm.jpg)

如上图所示，

$$
\mathbf{rotate}(\theta) = 
\begin{pmatrix}
\cos \theta & -\sin \theta	        \\\\
\sin \theta & \cos \theta           \\\\
\end{pmatrix}
$$

推导：

设 
$
\mathbf{rotate}(\theta) = 
\begin{pmatrix}
a & b \\\\ c & d
\end{pmatrix}
$

对于任意向量 $\mathbf{r}$ ，一定有 $\mathbf{r}' = \mathbf{rotate}(\theta) \mathbf{r}$

则取单位向量 $\hat{\mathbf{r}} = (1, 0)^T$ ，由上图，通过三角函数的计算得到旋转后向量为 $\hat{\mathbf{r}}' = (\cos \theta, \sin \theta)^T$

因此，一定有下式成立

$$
\begin{pmatrix}
\cos \theta \\\\ \sin \theta
\end{pmatrix} = 
\begin{pmatrix}
a & b \\\\ c & d
\end{pmatrix}
\begin{pmatrix}
1 \\\\ 0
\end{pmatrix}
$$

得到

$$a = \cos \theta$$
$$c = \sin \theta$$

同理，取单位向量 $\hat{\mathbf{r}} = (0, 1)^T$ ，可以得到

$$b = -\sin \theta$$
$$d = \cos \theta$$

故

$$
\mathbf{rotate}(\theta) = 
\begin{pmatrix}
\cos \theta & -\sin \theta	        \\\\
\sin \theta & \cos \theta           \\\\
\end{pmatrix}
$$

值得一提的是，根据定义， 
$
\mathbf{rotate}(\theta)^{-1} = 
\mathbf{rotate}(-\theta) = 
\begin{pmatrix}
\cos \theta & \sin \theta	        \\\\
-\sin \theta & \cos \theta           \\\\
\end{pmatrix} = 
\mathbf{rotate}(\theta)^T
$

也就是旋转矩阵的逆和它的转置相等，旋转矩阵是正交矩阵。

## 2D 非线性变换

### 平移(Translation)

平移并非线性变换，其过程不能表示为矩阵与向量的乘法。

$$
\mathbf{Trans}(t_x, t_y) = 
\begin{pmatrix}
t_x \\\\ t_y
\end{pmatrix}
$$

![](https://s2.loli.net/2021/12/22/yR8cT9iCVlWNjws.jpg)

如上图所示，

$$
\begin{pmatrix}
x' \\\\ y'
\end{pmatrix} = 
\begin{pmatrix}
x \\\\ y
\end{pmatrix} + 
\begin{pmatrix}
t_x \\\\ t_y
\end{pmatrix}
$$

上述所有线性变换和平移均可用以下一个公式表示

$$
\begin{pmatrix}
x' \\\\ y'
\end{pmatrix} = 
\begin{pmatrix}
a & b \\\\ c & d
\end{pmatrix}
\begin{pmatrix}
x \\\\ y
\end{pmatrix} + 
\begin{pmatrix}
t_x \\\\ t_y
\end{pmatrix}
$$

但将平移和其他线性变换区分开，并为平移使用一种新的计算方法（加法），并不是我们所期待。

因此考虑一种方法，能够只使用矩阵乘法，表示以上所有变换。

## 齐次坐标

为 2D 的点、向量均按照如下规则增加一个维度，

$$\mathbf{2D}\ \mathbf{point} = (x, y, 1)^T$$
$$\mathbf{2D}\ \mathbf{vector} = (x, y, 0)^T$$

那么，对于点的平移可表示为

$$
\begin{pmatrix}
x' \\\\ y' \\\\ 1
\end{pmatrix} = 
\begin{pmatrix}
1 & 0 & t_x \\\\ 0 & 1 & t_y \\\\ 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
x \\\\ y \\\\ 1
\end{pmatrix} =
\begin{pmatrix}
x + t_x \\\\ y + t_y \\\\ 1
\end{pmatrix}
$$

对于向量的平移表示为

$$
\begin{pmatrix}
x' \\\\ y' \\\\ 0
\end{pmatrix} = 
\begin{pmatrix}
1 & 0 & t_x \\\\ 0 & 1 & t_y \\\\ 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
x \\\\ y \\\\ 1
\end{pmatrix} =
\begin{pmatrix}
x  \\\\ y  \\\\ 0
\end{pmatrix}
$$

可以看到，对于向量的平移，得到的结果与原结果相同，这恰好体现了向量的平移不变性。

并且，根据以上定义，可以推导出

$$
\begin{aligned}
\mathbf{vector} &+ \mathbf{vector} = \mathbf{vector} \\\\
\mathbf{point} &- \mathbf{point} = \mathbf{vector} \\\\
\mathbf{point} &+ \mathbf{vector} = \mathbf{point} \\\\
\mathbf{point} &+ \mathbf{point} = \mathbf{??}
\end{aligned}
$$

定义：

$$
\begin{pmatrix}
x  \\\\ y  \\\\ w
\end{pmatrix}
\text{表示的点为}
\begin{pmatrix}
x/w  \\\\ y/w  \\\\ 1
\end{pmatrix}, w \ne 0
$$

仿射变换：

$$
\begin{pmatrix}
x' \\\\ y'
\end{pmatrix} = 
\begin{pmatrix}
a & b \\\\ c & d
\end{pmatrix}
\begin{pmatrix}
x \\\\ y
\end{pmatrix} + 
\begin{pmatrix}
t_x \\\\ t_y
\end{pmatrix}
$$

齐次坐标下：

$$
\begin{pmatrix}
x' \\\\ y' \\\\ 1
\end{pmatrix} = 
\begin{pmatrix}
a & b & t_x \\\\ c & d & t_y \\\\ 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
x \\\\ y \\\\ 1
\end{pmatrix}
$$

## 3D 线性变换

理同 2D 线性变换，在此给出三种线性变换在 3D 下的矩阵

缩放

$$
\mathbf{scale}(s_x, s_y, s_z) = 
\begin{pmatrix}
s_x & 0 & 0      \\\\
0 & s_y & 0      \\\\
0 & 0 & s_z
\end{pmatrix}
$$

剪切

$$
\mathbf{shear}_x(s_y, s_z) = 
\begin{pmatrix}
1 & s_y & s_z	        \\\\
0 & 1 & 0               \\\\
0 & 0 & 1
\end{pmatrix},
$$
$$
\mathbf{shear}_y(s_x, s_z) = 
\begin{pmatrix}
1 & 0 & 0	            \\\\
s_x & 1 & s_z           \\\\
0 & 0 & 1
\end{pmatrix},
$$
$$
\mathbf{shear}_z(s_x, s_y) = 
\begin{pmatrix}
1 & 0 & 0	            \\\\
0 & 1 & 0               \\\\
s_x & s_y & 1
\end{pmatrix},
$$

旋转

$$
\mathbf{rotate}_x(\theta) = 
\begin{pmatrix}
1 & 0 & 0   \\\\
0 & \cos \theta & -\sin \theta	        \\\\
0 & \sin \theta & \cos \theta           \\\\
\end{pmatrix},
$$
$$
\mathbf{rotate}_y(\theta) = 
\begin{pmatrix}
\cos \theta  & 0 & \sin \theta          \\\\
0 & 1 & 0	                            \\\\
-\sin \theta & 0 & \cos \theta          \\\\
\end{pmatrix},
$$
$$
\mathbf{rotate}_z(\theta) = 
\begin{pmatrix}
\cos \theta & -\sin \theta & 0	        \\\\
\sin \theta & \cos \theta & 0           \\\\
0 & 0 & 1
\end{pmatrix}
$$

## 3D 绕任意轴旋转

对于任何一个旋转，都可将其分解为绕三个坐标轴的旋转的组合。

$$
\mathbf{R}_{xyz}(\alpha, \beta, \gamma) = \mathbf{R}_x(\alpha) \mathbf{R}_y(\beta) \mathbf{R}_z(\gamma)
$$

其中， $\alpha, \beta, \gamma$ 被称为欧拉角。

在飞机模拟中常用到该方法分解旋转，并将三个坐标轴命名为 roll ， pitch ， yaw 。

![](https://s2.loli.net/2021/12/23/WGQfwL3R9FTodbv.jpg)

另一种常用的方法被称为罗德里格斯旋转公式 (Rodrigues' Rotation Formula) ，

对于一个过原点的轴，其方向向量为 $\mathbf{n}$ ，旋转角度为 $\alpha$

则旋转矩阵为 

$$
\mathbf{R}(\mathbf{n}, \alpha) = \cos(\alpha) \mathbf{I} + (1 - \cos(\alpha)) \mathbf{nn}^T + \sin(\alpha)
\begin{pmatrix}
0 & -n_z & n_y \\\\
n_z & 0 & -n_x \\\\
-n_y & n_x & 0
\end{pmatrix}
$$

另一种表达方式为

$$
\mathbf{R}(\mathbf{n}, \alpha) = \mathbf{I} + \sin(\alpha) \mathbf{N} + (1 - \cos(\alpha)) \mathbf{N}^2 
$$

其中， $\mathbf{N} = 
\begin{pmatrix}
0 & -n_z & n_y \\\\
n_z & 0 & -n_x \\\\
-n_y & n_x & 0
\end{pmatrix}$ 为向量 $\mathbf{n}$ 的叉乘矩阵。

上述两种表达方式中后者需要的参数更少，在旋转操作时更为常用。

对于旋转轴不过原点的情况，可以通过平移、旋转、平移的作法，将其旋转轴先平移至原点，再进行旋转，最后平移回到原位置。

## 3D 齐次坐标

$$\mathbf{3D}\ \mathbf{point} = (x, y, z, 1)^T$$
$$\mathbf{3D}\ \mathbf{vector} = (x, y, z, 0)^T$$

$$
\begin{pmatrix}
x' \\\\ y' \\\\ z' \\\\ 1
\end{pmatrix} = 
\begin{pmatrix}
a & b & c & t_x \\\\ d & e & f & t_y \\\\ g & h & i & t_z \\\\ 0 & 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
x \\\\ y \\\\ z \\\\1
\end{pmatrix}
$$