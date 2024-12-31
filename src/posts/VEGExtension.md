---
title: "VEG 拓展类型绑定"
date: 2023-04-01T23:54:08+08:00
toc: false
math: md
tags: ["Unity", "笔记"]
cover: https://s2.loli.net/2023/04/02/2GH39mEUs1iFVpu.png
---

VFX Graph 中将变量设置为暴露（Exposed）后，可以在 Inspector 中查看、修改该变量。

如需使用 C# 脚本控制暴露变量，需要为 VEG 特效物体挂载一个 VFX Property Binder 组件。

VFX Graph 内置了许多常用的变量绑定类型，但官方文档并未详细说明如何对 VFX Property Binder 进行拓展，使其支持自定义类型的变量绑定。

如需实现自定义类型的输入与处理，需要了解 `VFXPropertyBinder` 这一类的内部实现。

`VFXPropertyBinder` 类继承自 `MonoBehaviour` ，其中最重要的成员为 `List<VFXBinderBase> m_Bindings`.

该列表包含了当前物体上的 `VisualEffect` 的所有绑定，列表的所有成员都需要继承自 `VFXBinderBase`.

`VFXBinderBase` 类有两个重要的抽象方法，分别为 `IsValid` 和 `UpdateBinding`.

`IsValid` 方法用于判断当前绑定是否合法，只有当绑定合法的时候才会开始处理数据。

`UpdateBinding` 方法用于在绑定合法的情况下任意地处理绑定数据，再将处理结果交给 `VisualEffect`. 如果需要对输入数据进行采样、计算等处理，需要重写该方法来完成。

---

Unity 中对 `Transform` 类型实现绑定的方法是定义一个继承自 `VFXBinderBase` 的类 `VFXTransformBinder`.

其结构大致如下，完整代码见 [VFXTransformBinder.cs](https://github.com/NavidK0/unity-visualeffectgraph-builtin/blob/main/Runtime/Utilities/PropertyBinding/Implementation/VFXTransformBinder.cs)

```cs
public class VFXTransformBinder : VFXBinderBase
{
    protected ExposedParameter m_Parameter;
    public Transform Target;
    
    public string Parameter { get; set; }
    
    public override bool IsValid(VisualEffect component);
    protected override void OnEnable();
    public override string ToString();
    public override void UpdateBinding(VisualEffect component);
}
```

该类中保存了需要被绑定的数据 `Target` 以及被绑定的参数名称 `Parameter`.

效仿其做法，实现自定义 Serializable 类 MyDataType 的绑定，可以定义如下类

```cs
[VFXBinderAttribute(menuPath:"MyBinder/MyDataType")]
public class MyDataTypeBinder : VFXBinderBase
{
    public string PropertySpeed;
    public string PropertyColor;
    
    public MyDataType Target;

    public override bool IsValid(VisualEffect component)
    {
        return Target is not null && 
               component.HasInt(PropertySpeed) &&
               component.HasVector3(PropertyColor);
    }

    public override void UpdateBinding(VisualEffect component)
    {
        component.SetInt(PropertySpeed, Target.speed);
        component.SetVector3(PropertyColor, Target.color);
    }
    
    public override string ToString()
    {
        return $"MyDataType : '{PropertySpeed}', '{PropertyColor}'->{Target}";
    }
}
```

其中 `[VFXBinderAttribute(menuPath:"MyBinder/MyDataType")]` 用于向标准 VFX Property Binder 组件中注册该绑定，这样才能在 Inspector 中直接为物体添加该类型的绑定。

![20230401_1.png](https://s2.loli.net/2023/04/02/gm5XRh3LCfT1JEq.png)

类似地，令 `Target` 的类型继承自 `Object` 即可实现将 prefab 等物体拖拽到 Inspector 上进行绑定等效果。

![20230401_2.png](https://s2.loli.net/2023/04/02/1KCyqVuz4IBRidF.png)