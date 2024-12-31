---
title: "宝石光线追踪"
date: 2023-06-12T17:09:01+08:00
toc: true
math: md
tags: ["Unity", "图形学"]
cover: https://s2.loli.net/2023/06/13/NvPCgpLJaoFdt3V.jpg
grow:
---

最近看到了一个很惊艳的宝石光追的项目 [Sorumi/UnityRayTracingGem](https://github.com/Sorumi/UnityRayTracingGem).

原宝石光追的实现使用了 Compute Buffer 来向着色器传递模型数据。光线在每个 Mesh 内独立地反射与折射，不能在不同 Mesh 间互相传递。

在 2018 年微软发布了 DXR API 后，Unity 2019.3 加入了实验性的 Ray Tracing Shader，支持更方便地实现光追。

于是笔者就用 [SlightlyMad/SimpleDxrPathTracer](https://github.com/SlightlyMad/SimpleDxrPathTracer) 的框架复刻了一下这个宝石光追。

原项目的介绍已经在 [Sorumi 的博客](http://sorumi.xyz/posts/unity-ray-tracing-gem-shader/) 上写的很详细了，相同的部分就不再赘述。

## 递归改迭代

[SlightlyMad/SimpleDxrPathTracer](https://github.com/SlightlyMad/SimpleDxrPathTracer) 中提供了一个蒙特卡洛路径追踪算法。

由于宝石渲染中，所有物体都较为光滑，因此可以几乎不考虑漫反射，进而可以使用更简单的 Whitted-Style Ray Tracing.

Unity Ray Tracing Shader 递归层数有上限，考虑不使用在 Closest Hit Shader 中重新发射光线的递归写法，而是改为 Closest Hit Shader 修改 `payload` 后，回到 Ray Generate Shader 继续迭代生成光线。

```cpp
for (uint i = 0; i < gMaxDepth; i++)
{
    TraceRay(sceneAccelStruct, RAY_FLAG_NONE, 0xff, hitGroup, numHitGroups, missShader, ray, payload);
    if (payload.color <= 0)
    {
        break;
    }
    ray.Origin = payload.origin;
    ray.Direction = payload.direction;
}
RenderTarget[curPixel] = float4(payload.color, 1);
```

## Beer-Lambert 光线吸收

原项目中，光线只在单个 Mesh 内传播，且 Mesh 均为凸多面体，一旦光线射入 Mesh 内，就可以直接逐渐累加吸收距离（原文中 `ray.absorbDistance`）。

使用 Ray Tracing Shader，光线在到达 Miss Shader 之后或携带的能量为 $0$ 时才停止继续传播，即光线有可能通过多个吸收颜色不同的物体，故不能简单地累加吸收距离的做法模拟光线的吸收。

根据 Beer-Lambert 定律，透光度 $T_r(x_a, x_b)$ 表示光强在 $x_a, x_b$ 处的比值，有

$$
T_r(\mathbf{x}_a, \mathbf{x}_b) = e^{-\tau}, {\rm where} \tau = \int_{\mathbf{x} = \mathbf{x}_a}^{\mathbf{x}_b} \mathbf{\sigma}_t(\mathbf{x}) ||{\rm d}\mathbf{x}||
$$

其中 $\mathbf{\sigma}_t$ 为消光系数，$\mathbf{\sigma}_t = (1, 0, 0)$ 表明该物质仅以 $1$ 的强度吸收红色光。对于均匀介质，其值为常数。

Bavoil 提出，设目标距离 $D$ 处的目标光强为 $\mathbf{t}_c$，则消光系数为

$$
\mathbf{\sigma}_t = \frac{-\log(\mathbf{t}_c)}{D}
$$

剩余能量为

$$
\mathbf{remain}(d) = e^{\log(\mathbf{t}_c) \cdot d/D} = \mathbf{t}_c^{d/D}
$$

在 Shader 中暴露参数 `_ExtinctionColor` 和 `_ExtinctionDistance` 用于控制消光强度。

在 Closest Hit Shader 中，判断当前光线是否出射光，若是出射光，则降低剩余能量强度。

```cpp
const bool isOutgoing = step(0, dot(WorldRayDirection(), vertexNormal));
if (isOutgoing == 1)
{
    const float3 remainRate = pow(_ExtinctionColor, RayTCurrent() * rcp(_ExtinctionDistance));
    payload.energy *= remainRate;
}
```

新建一个极长的长方体，效果如下

![20230612_1.png](https://s2.loli.net/2023/06/13/Qzdws9P24NZ3agE.png)

可以看到，在较深的位置，显示的颜色接近黑色。这是由于上述代码仅降低了剩余能量，并没有提供颜色。图中呈现出的蓝色仅为反射光

考虑入射能量为 $\mathbf{E}$，剩余比例为 $\mathbf{R}(d) = \mathbf{t}_c^{\frac{d}{D}}$，目标颜色为 $\mathbf{t}_c$

可以认为该物质在距离 $d$ 处完全反射了一部分光，这部分光在经过一个 $d$ 的距离后回到入射面，最终传递回相机，则其提供的颜色为

$$
\mathbf{color} = \int_0^d \mathbf{E} \mathbf{R}^2(d) \mathbf{t}_c {\rm d}d = \frac{\mathbf{E} \mathbf{t}_c D (1 - \mathbf{R}^2(D))}{2\log(\mathbf{t}_c)}
$$

```cpp
if (isOutgoing == 1)
{
	const float3 remainRate = pow(_ExtinctionColor, RayTCurrent() * rcp(_ExtinctionDistance));
	payload.color -= 0.5 * (1 - remainRate * remainRate) * payload.energy * _ExtinctionColor * _ExtinctionDistance * rcp(log(_ExtinctionColor + epsilon));
	payload.energy *= remainRate;
}
```

修正后效果如下

![20230612_2.png](https://s2.loli.net/2023/06/13/NWBTdA1CyzagU7Z.png)

可以看到，当吸收距离足够长时，其呈现的颜色不再趋近于黑色。

## 色散

对于使用 RGB 存储的混合光照，并不能很方便地将其中每种频率的光拆分出来分别折射。

采用一个比较偷懒的方法，直接将光照拆分为 RGB 三种颜色，分别进行折射。

为 `RayPayload` 添加字段 `channel` 用于区分当前正在处理哪种颜色的光，Ray Generate Shader 迭代生成光线的部分修改如下

```cpp
RayDesc ray;
RayPayload payload;
for (payload.channel = 0; payload.channel < 3; payload.channel++)
{
    /* Initialize payload here */
    
    for (uint i = 0; i < gMaxDepth; i++)
    {
        TraceRay(sceneAccelStruct, RAY_FLAG_NONE, 0xff, hitGroup, numHitGroups, missShader, ray, payload);
        if (payload.color <= 0)
        {
            break;
        }
        ray.Origin = payload.origin;
        ray.Direction = payload.direction;
    }
    RenderTarget[curPixel][payload.channel] = payload.color;
}
RenderTarget[curPixel].a = 1;
```

设置一个全局数组 `refractionIndex[3]` 用于控制三种光线的折射率的扩大系数，并在 Shader 中暴露一个色散度系数 `_Dispersion` 。在折射时使用扩大系数的色散度次幂来扩大基础折射率。

```cpp
const float eta = lerp(rcp(_IOR * pow(refractionIndex[payload.channel], _Dispersion)), _IOR * pow(refractionIndex[payload.channel], _Dispersion), isOutgoing);
```

最终效果

![20230612_3.png](https://s2.loli.net/2023/06/13/gDbplW3k7UuFS1d.png)

桌面的反射效果是通过将其折射率设置为小于 $1$ 来实现的。