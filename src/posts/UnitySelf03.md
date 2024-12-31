---
title: "Unity笔记03"
date: 2021-09-06T12:08:35+08:00
toc: true
math: md
tags: ["Unity", "笔记"]
cover: https://i.loli.net/2021/09/07/v8uMpjYme9qa6zy.jpg
grow: 
---

本篇记录了物体移动以及摄像机跟随防抖动的实现。

---

## 键盘控制物体移动

使用 ```Input.GetAxis()``` 或 ```Input.GetAxisRaw()``` 获取 ```axisName``` 标识的虚拟轴的值。

以下内容摘自 Unity API.

> 对于键盘和游戏杆输入设备， ```GetAxis()``` 返回值是一个介于 -1 和 1 之间的浮点数。
>
> 该值的含义取决于输入控制的类型，例如，对于游戏杆的水平轴，值为 1 表示游戏杆向右推到底，值为 -1 表示游戏杆向左推到底；值为 0 表示游戏杆处于中性位置。
>
> 如果将轴映射到鼠标，该值会有所不同，并且不会在 -1...1 的范围内。此时，该值为当前鼠标增量乘以轴灵敏度。通常，正值表示鼠标向右/向下移动，负值表示鼠标向左/向上移动。
>
> ```GetAxisRaw()``` 与前者类似，但未应用平滑过滤。
>
>对于键盘和游戏杆输入，其返回值将处于 -1...1 的范围内。
>
>由于未对输入进行平滑处理，键盘输入将始终为 -1、0 或 1。

这里我使用了 ```GetAxisRaw()``` 进行键盘的输入。

首先创建一个方向变量。

```cs
Vector2 dir = Vector2.zero;
```

用两个变量记录该帧方向键是否被按下

```cs
float rh = Input.GetAxisRaw("Horizontal");
float rv = Input.GetAxisRaw("Vertical");
```

接着判断这两个变量的正负，并修改方向变量，注意向量单位化。

同时可以控制 ```animator``` ，修改所控制物体的朝向与移动动画。

```cs
if (rh < 0f)
{
    dir.x = -1;
    animator.SetInteger("Direction", 0);
}
else if (rh > 0f)
{
    dir.x = 1;
    animator.SetInteger("Direction", 1);
}

if (rv > 0f)
{
    dir.y = 1;
    animator.SetInteger("Direction", 2);
}
else if (rv < 0f)
{
    dir.y = -1;
    animator.SetInteger("Direction", 3);
}

dir.Normalize();
animator.SetBool("IsMoving", dir.magnitude > 0);
```

为物体赋予速度

```cs
GetComponent<Rigidbody2D>().velocity = speed * dir;
```

---

## 镜头跟随

一种简单的镜头跟随方式为

记录主角和镜头之间的初始相对位移，并在每一帧使用该相对位移修改摄像机位置，

达到主角和摄像机同步运动的效果。

代码如下

```cs
public GameObject target;

private void Start()
{
    if (target == null) return;

    offset = transform.position - target.position;
}

private void Update()
{
    if (target == null) return;

    transform.position = target.position + offset;
}
```

但该方法在主角撞击墙体的时候，可能会导致摄像机剧烈抖动。

一个简便的解决方案为，不让摄像机每时每刻都与主角的相对位置不变，

而是让摄像机跟随在主角身后，慢主角一步。

这样的效果就像是摄影师在跟随主角跑动一样。

这就需要用到插值，即 ```Vector3.Lerp()```

该函数原型为 

```cs
public static Vector3 Lerp (Vector3 a, Vector3 b, float t);
```

返回值为 ```a + (b - a) * t```

要求 ```t``` 的值限制在 0 到 1 之间。

在每次 ```Update()``` 的时候，不再直接修改 ```position```

而是使用

```cs
targetPos = target.position + offset;
transform.position = Vector3.Lerp(transform.position, targetPos, lerpSpeed);
```

此处 ```lerpSpeed``` 可以是一个较小的浮点数，如 ```0.01f``` ，

另外，为防止游戏帧率变化导致摄像机跟随速度变化，还可以将上述代码修改为

```cs
targetPos = target.position + offset;
transform.position = Vector3.Lerp(transform.position, targetPos, lerpSpeed * Time.deltaTime);
```

需要注意的是， ```Time.deltaTime``` 是以秒为单位，

在每次 ```Update()``` 的时候， ```Time.deltaTime``` 的值已经是一个较小的浮点数，

此时 ```lerpSpeed``` 应当作为 ```Time.deltaTime``` 的修饰系数。