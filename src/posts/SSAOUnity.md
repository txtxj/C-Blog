---
title: "屏幕空间环境光遮蔽（SSAO） Unity 实现"
date: 2022-07-12T15:45:35+08:00
toc: true
math: md
tags: ["Unity", "图形学"]
cover: https://s2.loli.net/2022/07/12/AGCIRLr9XN8Ksn7.jpg
grow: 
---

Games 101 大作业 Screen Space Ambient Occlusion With Unity

本文旨在记录大作业实现过程中遇到的各种问题与解决方案。

仓库地址：[https://github.com/txtxj/Screen-Space-Ambient-Occlusion](https://github.com/txtxj/Screen-Space-Ambient-Occlusion)

## 随机函数

```c
float fract(float x)
{
    return x - floor(x);
}
```

`fract` 函数返回浮点数的小数部分。

```c
float random(float2 st)
{
    return fract(sin(dot(st.xy, float2(12.9898,78.233))) * 43758.5453123);
}
```

`random` 函数用于生成一个随机浮点数，这是一个很用于着色器的经典随机数生成器。

```c
float3 random3(float2 seed)
{
    float3 vec;
    vec.x = random(seed);
    vec.y = random(seed * seed);
    vec.z = random(seed * seed * seed);
    return normalize(vec);
}
```

该函数使用一个二维向量（一般是 uv 坐标），生成一个归一化的三维随机向量，这个向量用于生成 TBN 矩阵。

```c
float3 sampling(float2 seed)
{
    float4 r;
    r.x = random(seed) * 2 - 1;
    r.y = random(seed * seed) * 2 - 1;
    r.z = random(seed * seed * seed);
    r.w = 1;
    r = normalize(r);
    return r.xyz;
}
```

与 `random3` 类似，但返回值的 `x` 和 `y` 方向范围在 $-1$ 和 $1$ 之间， `z` 方向范围在 $0$ 和 $1$ 之间，这个向量用于半球内采样。

## 顶点着色器

```c
v2f vert(appdata_full v)
{
    v2f o;
    o.position = UnityObjectToClipPos(v.vertex);
    o.uv = v.texcoord;
    o.screenPos = ComputeScreenPos(o.position);
    return o;
}
```

此处笔者曾尝试将计算屏幕空间坐标推迟到片段着色器进行，但效果如下图

![20220712_1.png](https://s2.loli.net/2022/07/12/oUhPbzOWD25yBYi.png)

可见明显条纹。

造成这一现象的原因是 `ComputeScreenPos()` 函数返回的是齐次坐标下屏幕空间的坐标值，其核心实现为

```c
float4 ComputeScreenPos(float4 pos)
{
    float4 o;
    o.x = pos.x * 0.5f + pos.w * 0.5f;
    o.y = pos.y * 0.5f * _ProjectionParams.x + pos.w * 0.5f;
    o.zw = pos.zw;
    return o;
}
```

然而投影变换不是线性变换，而片段着色器的插值是线性插值，这会导致该函数在投影前、投影后调用的结果不同。

## 片段着色器

```c
// Get view space normal and lineal0-1 depth
DecodeDepthNormal(tex2D(_CameraDepthNormalsTexture, i.uv), depth, normal);
normal.z *= -1;
```

从相机深度法线纹理中采样深度与法向，注意由于摄像机看向 z 轴负方向，该法线纹理的 z 分量需要取反。

```c
// screen space -> ndc -> clip space -> view space
float4 ndc = i.screenPos / i.screenPos.w * 2 - 1;
float4 clipPos = float4(ndc.xy, 1, 1) * _ProjectionParams.z;
float4 viewPos = mul(unity_CameraInvProjection, clipPos);
viewPos = viewPos / viewPos.w * depth;
```

从屏幕空间出发，三行依次计算出 ndc 空间坐标、裁剪空间坐标、观察空间坐标，我们接下来的采样工作均在观察空间中进行。

```c
// Get normal direction hemisphere TBN matrix
float3 tangent = random3(i.uv);
float3 bitangent = cross(normal, tangent);
tangent = cross(bitangent, normal);
float3x3 TBN = float3x3(tangent, bitangent, normal);
```

获取当前采样点的 TBN 矩阵，先随机一个向量，求法线与该向量的叉乘，结果作为副切线，再利用副切线与法线的乘积作为切线方向。

![20220712_2.png](https://s2.loli.net/2022/07/12/8IamxurzJtGTSZL.png)

接下来是在采样点半球内进行随机采样，计算遮挡百分比。

```c
float3 offset = sampling(j * i.uv);
float scale = j / _SampleCount;
// Bringing the sampling point closer to the centre of the ball
offset *= scale;
offset = mul(offset, TBN);
float weight = smoothstep(0, 1, length(offset));
```

使用 `sampling` 随机得到的向量模长服从 $0$ 到 $1$ 之间的均匀分布，而我们希望采样更多离球心更近的点，使得估计的方差不会太大。

因此使用一个 `scale` 作为约束，让采样点更靠近球心。

另外，使用 `weight` 参数作为权重，采样点离球心越远，该采样点对球心的遮挡效果越明显。

```c
// samp: view space -> clip space -> ndc
float3 samp = viewPos + offset * _SampleRadius;
samp = mul(unity_CameraProjection, samp);
samp /= samp.z;
samp = (samp + 1) * 0.5;
float sampDepth = 0;
float3 sampNormal = 0;
DecodeDepthNormal(tex2D(_CameraDepthNormalsTexture, samp.xy), sampDepth, sampNormal);
ao += abs(sampDepth - depth) < _DepthRange && depth > sampDepth + 0.0001 ? weight : 0;
```

与球心点的操作相反，将采样点从观察空间变换到 ndc 空间中，采样得到该点的深度，计算遮挡关系。

## 参考资料

 - https://www.bilibili.com/video/BV16q4y1U7S3?p=2
 - https://www.bilibili.com/video/BV1YK4y1T7yY?p=8
 - https://blog.csdn.net/linuxheik/article/details/86691117
 - https://zhuanlan.zhihu.com/p/148627526
 - https://zhuanlan.zhihu.com/p/510620589