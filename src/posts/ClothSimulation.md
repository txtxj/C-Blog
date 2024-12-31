---
title: "布料模拟与渲染"
date: 2022-07-30T15:50:01+08:00
toc: true
math: md
tags: ["Unity", "图形学"]
cover: https://s2.loli.net/2022/07/30/kEXcOuYz3aCjq15.jpg
grow: mid
---

仓库地址：[https://github.com/txtxj/Cloth-Simulation](https://github.com/txtxj/Cloth-Simulation)

本来上次的 SSAO 做完之后准备去做流体模拟的，结果因为完全不懂 GPU 编程，看不懂 compute shader ，并且以前没做过物理模拟而放弃了。

为了学习 GPU 编程和 PBD ，笔者选择了布料模拟这一个比较简单的题目来做（然而布料模拟并不是 PBD ），等搞明白之后再去尝试流体模拟。

然而在做这个项目的过程中，只能找到 CPU 布料模拟和 GPU 粒子效果，没找到 GPU 布料模拟，这对一个初学 GPU 编程的小白真的是巨大痛苦……

本文记录了笔者实现过程中遇到的各种问题。

---

## 物理基础

根据 Games101 课上的介绍，布料可以使用网格弹簧质点系统进行模拟。

使用一个由质点构成的矩阵，质点之间根据以下规则连接弹簧：

0. 连接横向、纵向相邻的质点，这种弹簧称为结构弹簧；
0. 连接对角线上的质点，这种弹簧称为剪切弹簧，这种弹簧能抵抗使布料剪切变形的力；
0. 连接横向、纵向相隔一个位置的质点，这种弹簧称为弯曲弹簧，这种弹簧能抵抗使布料折叠的力。

![20220730_1.jpg](https://s2.loli.net/2022/07/30/jY1Io8i6VHzBluX.jpg)

质点之间的弹簧力满足胡克定律

$$
\mathbf{f_{b \rightarrow a}} = -k_s \frac{\mathbf{b - a}}{||\mathbf{b - a}||}(||\mathbf{b - a}|| - l)
$$

理同 Games101 作业 8 ，先根据所有弹簧计算出所有质点的受力情况，再使用显式欧拉积分更新所有质点的速度、位置信息

```cpp
a = F / m
v(t + 1) = v(t) + a * dt
x(t + 1) = x(t) + v(t + 1) * dt
```

## 代码模拟（踩坑）

理论非常简单，但在实现过程中笔者踩了不少坑。

初次实现，笔者使用与 Games101 相同的代码框架，定义了质点类与弹簧类如下

```csharp
private struct Particle
{
    public Vector3 position;
    public Vector3 velocity;
    public Vector3 force;
    public float isFixed;
}

private struct Spring
{
    public Vector2Int node;
    public float length;
    public Spring(int a, int b)
    {
        node = new Vector2Int(a, b);
        length = (particles[a].position - particles[b].position).magnitude;
    }
}
```

并在 compute shader 中使用两个 kernel 分别计算每个弹簧贡献的力、每个粒子的速度与位置

```cpp
[numthreads(1024,1,1)]
void UpdateParticles(uint3 id : SV_DispatchThreadID)
{
    if (particles[id.x].isFixed) return;
    float3 acc = particles[id.x].force * wass + gravity;
    particles[id.x].velocity += acc * dt;
    particles[id.x].position += particles[id.x].velocity * dt;
    particles[id.x].force = float3(0, 0, 0);
}

[numthreads(1024,1,1)]
void UpdateSprings(uint3 id : SV_DispatchThreadID)
{
    int a = springs[id.x].node.x;
    int b = springs[id.x].node.y;
    float3 dir = particles[a].position - particles[b].position;
    float length = sqrt(dot(dir, dir));
    dir = normalize(dir);
    float3 force = ks * (length - springs[id.x].length) * dir;
    particles[a].force -= force;
    particles[b].force += force;
}
```

然而当程序运行起来的时候，却得到了这样的效果

![20220730_2.gif](https://s2.loli.net/2022/07/30/xuUHNEFcr25SjYz.gif)

粒子满天飞。

根据之前做弹簧模拟的经验，这是模拟步长 `dt` 过大和弹簧弹性系数 `ks` 过大导致的不稳定，进而失真。

接下来就是漫长的调参过程，在调参过程中发现，质点数量太多严重影响了系统的稳定性，因此笔者使用了最简单的 2x2 系统进行模拟测试。

如下图是一个比较合适的参数效果

![20220730_3.gif](https://s2.loli.net/2022/07/30/wVFuonz8WeDZ3U9.gif)

可以看到，除了上方两个固定的粒子，下方粒子产生了明显偏移，且偏移方向为左侧（序号较小）的粒子。

刚开始笔者认为这是因为重力太大，多个弹簧之间计算产生了不同的误差，误差逐渐积累导致粒子向左偏移，又进行了大量调参，但仍然得不到好的效果。

![20220730_4.gif](https://s2.loli.net/2022/07/30/Gsl8yQ9KznRji2H.gif)

如上，将阻力调大、重力调小、弹性系数调大之后，整个系统很稳定，但粒子仍然会向左偏移。

可以猜测是弹簧的某些 bug 导致了粒子左偏。

为了找到问题是否出在弹簧身上，笔者首先制作了 1xn 的普通弹簧，发现弹簧并没有任何问题，其表现与 Games101 中作业同样优秀。

但将粒子列数调多，制成布料，又出现了粒子满天飞的情况。

若将剪切弹簧和弯曲弹簧删去，只保留结构弹簧，粒子变得稳定，得到了如下结果

![20220730_5.gif](https://s2.loli.net/2022/07/30/6bi5eQWMgT9UldV.gif)

所有粒子均向左偏，并最终稳定地保持在一条线上，而右上角的固定粒子似乎与其他所有粒子都毫无关系。

自然可以推测，右方粒子没有给其下方粒子提供任何力，其弹簧实际上是无效的。

这时笔者才想到，很可能 GPU 的并行计算并不能给自身线程所使用的数据上锁，否则会降低并行性。

也就是说，在 `UpdateSprings` 函数中，只有编号较小的弹簧能够顺利执行 `particles[a].force -= force;` 和 `particles[b].force += force;` 操作并将其结果写入内存。

修改 `UpdateSprings` 函数，令其只能更新未被更新过的粒子的受力情况，发现模拟结果与之前一致，证明了上述猜测正确。

## 代码模拟（正解）

考虑另外一种计算受力的方法，删除弹簧类，将 `UpdateSprings` 函数改为对每个粒子求解一次约束，求解过程中不修改其他粒子的物理信息。所有粒子的受力情况求解完成之后，使用另一个 kernel 求其加速度、速度、位置。

由于布料固定为一个矩阵，任意与粒子 p 相连的其他粒子和粒子 p 之间的偏移量可以使用一个长度为 12 的数组表示

```cpp
static int2 springs[12] =
{
    int2(0, -1), int2(0, 1), int2(-1, 0), int2(1, 0), // Structure
    int2(-1, -1), int2(-1, 1), int2(1, -1), int2(1, 1), // Shearing
    int2(0, -2), int2(0, 2), int2(-2, 0), int2(2, 0) // Bending 
};
```

对于每个粒子，通过其 `id` 计算出二维坐标，再加上上述偏移量，即可得到与其相连的粒子。

```cpp
// reststore three original spring lengths
float3 rest;

[numthreads(1024,1,1)]
void UpdateSprings(uint3 id : SV_DispatchThreadID)
{
    const int index = id.x;
    if (index >= size.z) return; // Out of range
    if (particles[index].isFixed) return;
    id.xy = GetId(index);
    for (int i = 0; i < 12; i++)
    {
        const int2 pos = id.xy + springs[i];
        if (IsValid(pos))
        {
            const int posIndex = GetIndex(pos);
            const float3 dir = particles[posIndex].position - particles[index].position;
            const float3 ndir = normalize(dir);
            // spring
            particles[index].force += ks * (length(dir) - rest[i / 4]) * ndir;
            // damping
            particles[index].force -= kd * dot(ndir, particles[index].velocity) * ndir;
            // gravity
            particles[index].force += gravity * mass;
        }
    }
}
```

最终效果非常好

![20220730_6.gif](https://s2.loli.net/2023/01/10/HrwCEl9BPJN1cAh.gif)

然而实际上笔者在实现过程中还遇到了一个离奇的 bug 。

使用如下代码进行 `index` 和 `id` 的互相转化，会出现只有第一列粒子运动的情况（即只有第一列粒子被更新）。

```cpp
int2 GetId(int index)
{
    return int2(index / size.y, index % size.y);
}

int GetIndex(int2 id)
{
    return id.x * size.y + id.y;
}
```

经过巨大痛苦的 debug 之后发现原因是 compute shader 中布料大小参数 `size` 的类型是 `int3` ，

而在 c# 文件中则使用了

```csharp
compute.SetVector("size", new Vector3(clothSize.x, clothSize.y, clothSize.x * clothSize.y));
```

进行赋值。

c# 代码使用三个 int 类型变量生成一个 `Vector3` 类型（也即 `float3`）变量，并将其按照 IEEE754 标准写入了 compute shader 里 `size` 的地址中，

导致 `size` 数据极大，在更新第二列及后续数据时被判定越界。

正确写法是

```csharp
compute.SetInts("size", new int[]{clothSize.x, clothSize.y, clothSize.x * clothSize.y});
```

## 渲染

使用 `Graphics.DrawProceduralNow` 绘制点，或提供 `indexBuffer` 绘制三角形。

```csharp
Graphics.DrawProceduralNow(MeshTopology.Points, particleCount); // Draw points
Graphics.DrawProceduralNow(MeshTopology.Triangles, indexBuffer, indexBuffer.count); // Draw triangles
```

`indexBuffer` 提供了每个三角形三个顶点在顶点数组中的索引。

```csharp
private void InitiateIndexBuffer()
{
    List<int> indices = new List<int>();
    for (int i = 1; i < clothSize.x; i++)
    {
        for (int j = 1; j < clothSize.y; j++)
        {
            int id = i * clothSize.y + j;
            indices.Add(id - clothSize.y - 1);
            indices.Add(id - clothSize.y);
            indices.Add(id);
            indices.Add(id);
            indices.Add(id - 1);
            indices.Add(id - clothSize.y - 1);
        }
    }
    indexBuffer = new GraphicsBuffer(GraphicsBuffer.Target.Index, indices.Count, sizeof(int));
    indexBuffer.SetData(indices);
}
```
对于除了第 0 行、第 0 列的顶点，将其左上方的两个三角形的六个顶点按逆时针（或顺时针）顺序输入数组中。

![20220730_7.jpg](https://s2.loli.net/2022/08/03/j5KcmWnYbEU7GeO.jpg)

再使用微表面 Blinn-Phone 模型着色，得到如下结果

![20220730_8.gif](https://s2.loli.net/2023/01/10/6tU3mJdRbHXsoYy.gif)

