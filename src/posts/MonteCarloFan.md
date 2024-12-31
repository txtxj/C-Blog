---
title: "蒙特卡洛风扇"
date: 2024-03-14T20:08:59+08:00
toc: false
math: md
tags: ["Unity"]
cover: https://s2.loli.net/2024/05/22/TG6RAa9QWb1Lm3g.jpg
---

暑期实习做究极手的时候想到的用来模拟风扇的方法，后来虽然没做究极手，去做了个 mini 版人类一败涂地，但还是把这个功能实现了，当作全游第二大的特点。

现实中的风扇出风一般不是时刻均匀的，如果把一张纸放在风扇上，会被随机地吹开，而不能稳定地浮在风扇上。

考虑类似光线追踪算法的方式，使用蒙特卡洛积分来计算风扇对物体的吹力。在每一物理帧中，依照概率对风扇出风面采样，得到一个或多个采样点。从采样点向出风方向（方向也可以依概率随机采样）发射一条风力线，并进行射线检测，在最近撞击点对目标物体施加一个推动力。图中白线为风扇发射出的风力线。

<ImageContainer>
<n-image src="https://s2.loli.net/2024/05/22/5iugsatnf2N8DWT.png" alt="20240314_1.png" />
<n-image src="https://s2.loli.net/2024/05/22/jhpsSc5wyxAr3mT.png" alt="20240314_2.png" />
<n-image src="https://s2.loli.net/2024/05/22/WjyawmPI1xhcQE4.png" alt="20240314_3.png" />
</ImageContainer>

P3 在风力线打在物体表面时，从命中点沿切线再发射一次风力线，模拟物体把风分割开的效果。本来是准备用这个特性做一个需要障碍物改变风向的小关卡，但没想好关卡怎么设计，所以没怎么调切向风，效果不太好。

实现方式类似于光线追踪，部分代码如下：

```cs
public int monteMax; // 每帧采样次数
public float maxForce; // 最大风力
public float maxDistance; // 最大触发距离
public float radius; // 风扇半径
private float forceRate; // 风扇效率 档位

private void DetectItemAndAddForce()
{
    Transform tr = transform;
    Vector3 center = tr.position;
    float alpha = forceRate * maxForce / (maxDistance * maxDistance * monteMax);
    for (int i = 0; i < monteMax; i++)
    {
        Vector2 rand = Random.insideUnitCircle * radius; // 单位圆均匀采样
        Vector3 origin = center + rand.x * tr.right + rand.y * tr.forward;
        Vector3 direction = transform.up;
        
        WindRayCast(origin, direction, 2, alpha, maxDistance, maxForce);
    }
}

private void WindRayCast(Vector3 origin, Vector3 direction, int depth, float alpha, float restDistance, float restForce)
{
    if (depth == 0) return;
    
    Ray ray = new Ray(origin, direction);
    if (Physics.Raycast(ray, out RaycastHit hitInfo, restDistance, ~LayerMask.GetMask("Ground")))
    {
        Vector3 force = Mathf.Pow(restDistance - hitInfo.distance, 2) * alpha * direction;
        Vector3 forceNormal = Vector3.Dot(force, hitInfo.normal) * hitInfo.normal;
        float forceTangent = (force - forceNormal).magnitude;
        if (hitInfo.collider.TryGetComponent(out Rigidbody rb) && !rb.isKinematic)
        {
            rb.AddForceAtPosition(forceNormal, hitInfo.point);
        }
            
        // 切线分量
        origin = hitInfo.point + hitInfo.normal * 0.1f;
        direction -= Vector3.Dot(hitInfo.normal, direction) * hitInfo.normal;
        alpha /= restDistance * restDistance;
        restDistance -= hitInfo.distance;
        alpha *= restDistance * restDistance * forceTangent / restForce;
        
        WindRayCast(origin, direction, depth - 1, alpha, restDistance, forceTangent);
    }
}
```