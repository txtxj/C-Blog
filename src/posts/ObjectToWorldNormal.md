---
title: "法线向量的模型-世界变换"
date: 2022-05-16T22:44:43+08:00
toc: true
math: md
tags: ["Unity", "图形学", "笔记"]
cover: https://s2.loli.net/2022/05/16/Um8rKAjiHdPbhLM.jpg
grow: 
---

## 为什么法线向量变换到世界坐标下需要右乘模型变换矩阵的逆矩阵

在 《Unity ShaderLab 新手宝典》 中 64 页给出了一个结论

> 在顶点函数中，使用 Unity 提供的变换矩阵 `unity_ObjectToWorld` 将顶点坐标从模型空间变换到世界空间。为了避免非统一缩放的物体法线方向偏移，使用法线向量右乘逆矩阵的方式对其进行空间变换。

即 `worldNormal = mul(vertex， (float3x3)unity_WorldToObject)` 。

首先解释为什么对于非统一缩放的物体，左乘模型变换矩阵可能会导致法线方向偏移。

考虑一个正方形，它的两条对角线是互相垂直的。

![20220516_1.jpg](https://s2.loli.net/2022/05/16/fgJo7bsYwK53uRd.jpg)

但在将其 $x$ 方向变换为原来的 $\frac{1}{2}$ 之后，两条对角线不再互相垂直。

![20220516_2.jpg](https://s2.loli.net/2022/05/16/PlUB19D8XnEmFof.jpg)

将上述变换写为矩阵乘法的形式，
$$
\text{令}\  \mathbf{n} = \overrightarrow{AC}, \mathbf{a} = \overrightarrow{BD} \ \text{为列向量}\\\\
\mathbf{n}^T \mathbf{a} = 0\\\\
\text{变换后}\ \mathbf{n'} = \mathbf{Mn}, \mathbf{a'} = \mathbf{Ma}\\\\
\mathbf{n'}^T\mathbf{a'} = \mathbf{n}^T \mathbf{M}^T \mathbf{Ma}
$$

由于模型变换矩阵 $\mathbf{M}$ 并不一定是正交矩阵，无法保证 $\mathbf{M}^T\mathbf{M} = \mathbf{I}$ ，因此也就无法保证 $\mathbf{n'}^T\mathbf{a'} = 0$ ，即 $\mathbf{n'}$ 与 $\mathbf{a'}$ 不一定垂直。

从上式不难看出，如果想要变换后向量 $\mathbf{a'}$ 与其法向量 $\mathbf{n'}$ 仍保持垂直关系，那么一定有
$$
\mathbf{n'}^T\mathbf{a'} = \mathbf{n}^T \mathbf{M}^{-1} \mathbf{Ma} = \mathbf{n}^T \mathbf{a} = 0
$$
故 $\mathbf{n'}^T = \mathbf{n}^T \mathbf{M}^{-1}$ ，法向量需要右乘模型变换矩阵的逆变换矩阵。

以下为 `UnityCG.cginc` 中的法向量模型-世界变换函数原型。

```cpp
// Transforms normal from object to world space
inline float3 UnityObjectToWorldNormal( in float3 norm )
{
#ifdef UNITY_ASSUME_UNIFORM_SCALING
    return UnityObjectToWorldDir(norm);
#else
    // mul(IT_M, norm) => mul(norm, I_M) => {dot(norm, I_M.col0), dot(norm, I_M.col1), dot(norm, I_M.col2)}
    return normalize(mul(norm, (float3x3)unity_WorldToObject));
#endif
}
```

