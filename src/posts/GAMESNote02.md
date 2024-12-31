---
title: "GAMES笔记02-模型、视图、投影变换"
date: 2021-12-23T20:18:27+08:00
toc: true
math: mathjax
tags: ["图形学", "笔记"]
cover: https://s2.loli.net/2021/12/24/fbnAEsC54U9DXmN.jpg
grow: 
---

## 模型变换(Model Transformation)

通过缩放、旋转、平移，将物体变换到合适的位置。

## 视图变换(Viewing Transformation)

视图变换是通过调整摄像机，得到物体与摄像机之间相对位置的变换。

为了确定相机的位置(Position)，需要一个向量 $\mathbf{e}$

为了确定相机的朝向(Look-at / gaze direction)，需要一个向量 $\hat{\mathbf{g}}$

为了确定相机的正上方向(Up direction)，需要一个向量 $\hat{\mathbf{t}}$

此处相机的正上方向是为了确定相机拍摄时，图像的正上方所指向的位置。

试想，如果一个相机的位置和朝向都已经确定，相机仍然可以以其朝向为轴旋转，因此必须使用 $\hat{\mathbf{t}}$ 限制相机的正上方向。

在实际应用中，我们只关心物体与相机的相对位置，因此可以考虑把相机变换到原点，并使相机的坐标轴与空间坐标轴重合，这样一来，变换后物体在空间中的坐标就是物体与相机的相对坐标了。

将相机移动到原点 $\mathbf{e} = \mathbf{0}$

正上方向为朝向 $Y$ 轴 $\hat{\mathbf{t}} = \hat{\mathbf{y}}$

相机朝向为 $Z$ 轴负方向 $\hat{\mathbf{g}} = -\hat{\mathbf{z}}$

同时，将空间中所有物体跟随相机进行变换。

考虑使用一个矩阵 $\mathbf{M_{view}}$ 表示上述变换。

那么， $\mathbf{M_{view}}$ 需要完成的操作包含：

 - 将 $\mathbf{e}$ 变换到原点
 - 将 $\hat{\mathbf{g}}$ 旋转到 $-\hat{\mathbf{z}}$
 - 将 $\hat{\mathbf{t}}$ 旋转到 $\hat{\mathbf{y}}$
 - 将 $\hat{\mathbf{g}} \times \hat{\mathbf{t}}$ 旋转到 $\hat{\mathbf{x}}$

对于上述操作的第一步平移操作，可以用一个矩阵 $\mathbf{T_{view}}$ 表示，

则 $\mathbf{M_{view}} = \mathbf{R_{view}} \mathbf{T_{view}}$，

并且可以很轻松地写出平移变换矩阵

$$
\mathbf{T_{view}} = 
\begin{pmatrix}
1 & 0 & 0 & -x_e \\\\
0 & 1 & 0 & -y_e \\\\
0 & 0 & 1 & -z_e \\\\
0 & 0 & 0 & 1
\end{pmatrix}
$$

而对于旋转操作，并没有那么容易，

考虑旋转变换矩阵 $\mathbf{R_{view}}$ 的逆矩阵，即 $\mathbf{R_{view}}^{-1}$ ，

该矩阵完成的操作为：

 - 将 $\hat{\mathbf{z}}$ 旋转到 $-\hat{\mathbf{g}}$
 - 将 $\hat{\mathbf{y}}$ 旋转到 $\hat{\mathbf{t}}$
 - 将 $\hat{\mathbf{x}}$ 旋转到 $\hat{\mathbf{g}} \times \hat{\mathbf{t}}$

由于旋转前的三个轴形式简单，所以可以分别取三个方向的单位向量，用该矩阵左乘这三个方向，得到旋转后的矩阵

$$
\begin{pmatrix}
\hat{\mathbf{g}} \times \hat{\mathbf{t}} &
\hat{\mathbf{t}} &
-\hat{\mathbf{g}} 
\end{pmatrix} = 
\mathbf{R_{view}}^{-1}
\begin{pmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 1 \\\\
0 & 0 & 0
\end{pmatrix}
$$

可以直接写出旋转矩阵的逆为

$$
\mathbf{R_{view}}^{-1} = 
\begin{pmatrix}
x_{\hat{\mathbf{g}} \times \hat{\mathbf{t}}} & x_t & x_{-g} & 0 \\\\
y_{\hat{\mathbf{g}} \times \hat{\mathbf{t}}} & y_t & y_{-g} & 0 \\\\
z_{\hat{\mathbf{g}} \times \hat{\mathbf{t}}} & z_t & z_{-g} & 0 \\\\
0 & 0 & 0 & 1
\end{pmatrix}
$$

而旋转矩阵是正交矩阵，其逆与转置相等

所以原旋转矩阵为

$$
\mathbf{R_{view}} = 
\begin{pmatrix}
x_{\hat{\mathbf{g}} \times \hat{\mathbf{t}}} & y_{\hat{\mathbf{g}} \times \hat{\mathbf{t}}} & z_{\hat{\mathbf{g}} \times \hat{\mathbf{t}}} & 0\\\\
x_t & y_t & z_t & 0 \\\\
x_{-g} & y_{-g} & z_{-g} & 0 \\\\
0 & 0 & 0 & 1
\end{pmatrix}
$$

## 投影变换(Projection Transformation)

投影变换的作用是，将 3D 的物体映射到 2D 的图像上。

投影变换有两种类型，分别是正交投影变换(Orthographic Projection)和透视投影变换(Perspective projection)。

![](https://s2.loli.net/2021/12/25/UONX9pFLKPkHJ3w.jpg)

![](https://s2.loli.net/2021/12/25/u4JNLKTI6oZhHA1.jpg)

### 正交投影变换(Orthographic Projection)

对于正交投影变换，一个简单的做法是：

 - 视图变换
 - 将所有物体 Z 坐标变为 0 
 - 将坐标变换（缩放）到 $[-1,1]^2$ 的区域中

但通过上述方法变换得到的结果并不能反映物体之间的前后顺序，因此考虑另一种变换方法。

考虑在视图变换后，将所有物体都变换到 $[-1,1]^3$ 的正方体中。

这个正方体称为标准正方体。

假设有一个长方体 $[l,r] \times [b,t] \times [f,n]$ 需要被投影变换到 $[-1,1]^3$ 。

那么整个过程如下：

 - 将长方体的中心移动到原点
 - 将长方体的每条边长度缩放为 2

因此可以写出该变换的矩阵为

$$
\mathbf{M_{ortho}} = 
\begin{pmatrix}
\frac{2}{r - l} & 0 & 0 & 0 \\\\
0 & \frac{2}{t - b} & 0 & 0 \\\\
0 & 0 & \frac{2}{n - f} & 0 \\\\
0 & 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
1 & 0 & 0 & -\frac{r + l}{2} \\\\
0 & 1 & 0 & -\frac{t + b}{2} \\\\
0 & 0 & 1 & -\frac{n + f}{2} \\\\
0 & 0 & 0 & 1
\end{pmatrix} = 
\begin{pmatrix}
\frac{2}{r - l} & 0 & 0 & -\frac{r + l}{r - l} \\\\
0 & \frac{2}{t - b} & 0 & -\frac{t + b}{t - b} \\\\
0 & 0 & \frac{2}{n - f} & -\frac{n + f}{n - f} \\\\
0 & 0 & 0 & 1
\end{pmatrix}
$$

### 透视投影变换(Perspective projection)

相比于正交投影，透视投影更像是人肉眼所看到的画面，满足远小近大的透视关系。

在透视投影变换中，原来平行的两条线，可能会不再平行。

例如两条平行的轨道，可以看到图中两条轨道交于一点，并且这一点在图像上是可以找到的。

![](https://s2.loli.net/2021/12/26/gIA5sHb9LvcF7xa.jpg)

为了完成透视投影变换，可以将操作分为以下两步：

 - 将可视空间变换为长方体
 - 对这一长方体进行正交投影变换

![](https://s2.loli.net/2021/12/26/Cc56AxIJN3f8jiO.jpg)

如上图，左侧为原可视空间（假设 n 为视平面， f 是需要变换的最远处平面）。

考虑可视空间中任意一点 $(x, y, z)^T$ ，其变换后坐标为 $(x', y', z')^T$ 。

从侧面来看（只看 Y 轴的变换），可以看出变换后点的 Y 坐标为 $y' = \frac{n}{z}y$ 。

![](https://s2.loli.net/2021/12/26/vKxnHkParzoFq1O.jpg)

对于 X 轴的变换同理，可以得到变换后点的坐标为 $(\frac{n}{z}x, \frac{n}{z}y, z')^T$

使用齐次坐标表示，

$$
\begin{pmatrix}
x \\\\ y \\\\ z \\\\ 1
\end{pmatrix} \Rightarrow 
\begin{pmatrix}
nx/z \\\\ ny/z \\\\ \text{unknow} \\\\ 1
\end{pmatrix} =
\begin{pmatrix}
nx \\\\ ny \\\\ \text{still unknow} \\\\ z
\end{pmatrix} (\text{mult. by z})
$$

因此，我们希望找到一个矩阵 $\mathbf{M_{persp\rightarrow ortho}^{4\times 4}}$ ，使得

$$
\mathbf{M_{persp\rightarrow ortho}^{4\times 4}}
\begin{pmatrix}
x \\\\ y \\\\ z \\\\ 1
\end{pmatrix} =
\begin{pmatrix}
nx \\\\ ny \\\\ \text{still unknow} \\\\ z
\end{pmatrix}
$$

可以得到

$$
\mathbf{M_{persp\rightarrow ortho}} = 
\begin{pmatrix}
n & 0 & 0 & 0 \\\\
0 & n & 0 & 0 \\\\
? & ? & ? & ? \\\\
0 & 0 & 1 & 0
\end{pmatrix}
$$

下面考虑该矩阵第三行的值。

规定：

 - 可视空间中距离相机最近的平面上的点，变换后保持不变
 - 可视空间中距离相机最远的平面上的点，变换后 Z 坐标保持不变

由第一条规定，将上述所有 $z$ 替换为 $n$ ，得到下式

$$
\begin{pmatrix}
x \\\\ y \\\\ n \\\\ 1
\end{pmatrix} \Rightarrow 
\begin{pmatrix}
x \\\\ y \\\\ n \\\\ 1
\end{pmatrix} =
\begin{pmatrix}
nx \\\\ ny \\\\ n^2 \\\\ n
\end{pmatrix}
$$

由于 $n^2$ 与 $x$ 和 $y$ 无关，矩阵第三行可以设为 
$
\begin{pmatrix}
0 & 0 & A & B
\end{pmatrix}
$

$$
\begin{pmatrix}
0 & 0 & A & B
\end{pmatrix}
\begin{pmatrix}
x \\\\ y \\\\ n \\\\ 1
\end{pmatrix} = (n^2)
$$

所以 $An + B = n^2$

由第二条规定，代入较远平面的中心点，得到下式

$$
\begin{pmatrix}
0 & 0 & A & B
\end{pmatrix}
\begin{pmatrix}
x \\\\ y \\\\ f \\\\ 1
\end{pmatrix} = (f^2)
$$

即 $Af + B = f^2$

联立上式可以解得 $A = n + f, B = -nf$

故矩阵为

$$
\mathbf{M_{persp\rightarrow ortho}} = 
\begin{pmatrix}
n & 0 & 0 & 0 \\\\
0 & n & 0 & 0 \\\\
0 & 0 & n + f & -nf \\\\
0 & 0 & 1 & 0
\end{pmatrix}
$$

最后，将上述变换后的长方体空间正交投影变换到 $[-1,1]^3$ ，得到透视变换投影矩阵如下

$$
\mathbf{M_{persp}} = 
\mathbf{M_{ortho}}
\mathbf{M_{persp\rightarrow ortho}} = 
\begin{pmatrix}
\frac{2n}{r - l} & 0 & \frac{l + r}{l - r} & 0 \\\\
0 & \frac{2n}{t - b} & \frac{b + t}{b - t} & 0 \\\\
0 & 0 & \frac{n + f}{n - f} & -\frac{2nf}{n - f} \\\\
0 & 0 & 1 & 0
\end{pmatrix}
$$