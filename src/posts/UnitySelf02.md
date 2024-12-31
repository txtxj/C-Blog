---
title: "Unity笔记02"
date: 2021-05-03T01:46:19+08:00
toc: true
math: md
tags: ["Unity", "笔记"]
cover: https://i.loli.net/2021/07/31/4QMk3yYFNqzoRu8.jpg
grow: 
---

本篇笔记记录了后座力的实现。

---

## 后座力（AddForce）与移动（velocity）不兼容

用 ```AddForce``` 给玩家添加一个反向的作用力后，

如果玩家正在进行移动，

由于移动是直接对刚体的 ```velocity``` 进行操作，

所以玩家受到的反作用力会在一瞬间消失。

实现的效果就是看到玩家向后闪了一小段距离。

---

## 解决方案

考虑角色的移动也用 ```AddForce``` 实现，

当方向键按下的时候判断该方向的速度是否达到最大速度，

如果没有达到最大速度就给玩家加一个对应的力。

```cs
private float speed = 2f;
private void FixedUpdate()
{
    float rh = Input.GetAxisRaw("Horizontal");
    float rv = Input.GetAxisRaw("Vertical");
    if (rh > 0f && GetComponent<Rigidbody2D>().velocity.x < speed)
    {
        GetComponent<Rigidbody2D>().AddForce(new Vector2(speed, 0f) * 10f);
    }
    else if (rh < 0f && GetComponent<Rigidbody2D>().velocity.x > -speed)
    {
        GetComponent<Rigidbody2D>().AddForce(new Vector2(-speed, 0f) * 10f);
    }
    if (rv > 0f && GetComponent<Rigidbody2D>().velocity.y < speed)
    {
        GetComponent<Rigidbody2D>().AddForce(new Vector2(0f, speed) * 10f);
    }
    else if (rv < 0f && GetComponent<Rigidbody2D>().velocity.y > -speed)
    {
        GetComponent<Rigidbody2D>().AddForce(new Vector2(0f, -speed) * 10f);
    }
    //模拟摩擦力
    GetComponent<Rigidbody2D>().velocity *= 0.75f;
}
```

子弹发射时的后座力和以前一样用 ```AddForce``` 实现，不再赘述。