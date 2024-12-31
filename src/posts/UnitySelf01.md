---
title: "Unity笔记01"
date: 2021-01-02T18:08:34+08:00
toc: true
math: md
tags: ["Unity", "笔记"]
cover: "https://i.loli.net/2021/07/31/njYsavLF3e5SIr2.jpg"
grow: 
---

本篇笔记记录了瞬移魔法的穿墙问题的解决问题。

---

## 瞬移魔法穿墙问题

在 2021.1.1 的版本中，

如果玩家贴墙向墙内发射瞬移魔法，

由于发射口与玩家人物中心之间有一定的距离，

所以瞬移魔法发射的一瞬间，就已经位于墙内，

接着魔法立刻消失，玩家被传送至墙内。

网上查找解决方案，

关于防止子弹穿墙问题的解决方案大多是

发射射线，

然后在射线命中碰撞体时做出命中效果，

再发射一个物体作为子弹。

但在我的游戏中，魔法的移动速度并不快，

不能用射线这种瞬间判断是否命中的方式。

--- 

## 解决方案

给发射口加一个刚体组件和一个碰撞体组件，

且将碰撞体设置为触发器，

加入如下代码：

```cs
private void OnTriggerStay2D(Collider2D target)
{
    if (target.tag != "Player")
    {
        isfence = true;
    }
}

```
并在攻击时加入如下判断：
```cs
if (fr == 1f && isfire == false && isinterval == false && isfence == false)
{
    isfire = true;
    timeCounter = 0;
}
```
经测试，

当玩家面朝墙的时候，

按下攻击键不能使用魔法。

问题解决。

---

## 还是瞬移魔法穿墙问题

远距离发射瞬移魔法的时候，

可能由于角度问题，导致魔法仍然会卡进墙内，使得玩家瞬移入墙。

玩家入墙后，由于发射口与墙始终有接触，玩家不能发射任何魔法，

游戏卡死。

---

## 解决方案

网上查阅了Unity手册，

发现是因为子弹和障碍物的 ```Collision Detection``` 没有设置为 ```Continuous```。

将两者设置好后，再次测试，

发现玩家瞬移卡墙次数明显减少，

但偶尔还是会发生卡墙的情况。

下面给出一种解决方案，

这个方案是尝试了 5h 后偶然发现的，

不清楚原理是什么。

1. 给障碍物添加一个物理材质，将其弹性设置为 1。
2. 魔法离开碰撞体时将玩家传送至魔法所在的位置。

代码如下：

```cs
private void OnCollisionExit2D(Collision2D target)
{
    PlayerList.player[GetComponent<BulletInformation>().user].transform.position = transform.position;
    Destroy(gameObject);
}
```
