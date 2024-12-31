---
title: "Unity Editor Window 修复报错后仍无法打开"
date: 2023-05-21T00:46:58+08:00
toc: false
math: md
tags: ["Unity", "C#", "笔记"]
cover: https://s2.loli.net/2023/05/21/ml9HEgeWIbG6fQz.jpg
grow: mid
---

在 Unity 中编写自定义的 Editor Window 时，如果在窗口第一次 `OnGUI()` 调用前出现错误，则窗体无法被画出，并且无法关闭。

并且，Unity 在编译过修改后的代码后，不会自动关闭已经打开的错误窗口，这会导致即使修改后的代码是正确的，仍然无法打开窗口。

在这种情况下，可以观察到屏幕上有一个如下图所示的图标，无法交互、不随 Unity 主窗口移动、会随着 Unity 主窗口一起关闭。

![20230521_1.jpg](https://s2.loli.net/2023/05/21/1fxkaRLdJXs2z64.jpg)

这个图标即为之前打开的错误窗口。

此时需要在打开窗口之前先关闭一次窗口

修改代码如下：

```cs
[MenuItem("MyTools/MyEditorWindow")]
public static void Init()
{
    MyEditorWindow window = GetWindow<MyEditorWindow>();
    window.Close(); // 关闭错误窗口
    window.Show();
}
```

运行一次后，上图所示的图标消失，但窗口不会出现，再将代码中关闭窗口的操作删除，重新运行即可打开窗口。

也可以单独为关闭窗口操作设置一个新的 Menu Item

```cs
private static readonly Type[] WindowTypes = { typeof(Window1), typeof(Window2), typeof(Window3) };

[MenuItem("MyTools/CloseAll")]
    public static void CloseAll()
    {
        foreach (Type type in WindowTypes)
        {
            EditorWindow window = GetWindow(type);
            window.Close();
        }
    }
```