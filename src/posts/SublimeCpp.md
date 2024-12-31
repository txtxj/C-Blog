---
title: "为Sublime搭建C++环境"
date: 2020-08-25T22:03:36+08:00
toc: true
math: md
tags: ["笔记"]
cover: "https://s2.loli.net/2021/12/22/EJj7ytQgYoXNL9k.jpg"
grow: 
---

# Windows 下为 Sublime Text 3 搭建 C/C++环境

写这篇博客时，我正在为新电脑搭建 C/C++ 环境

---

步骤：

1. 下载 Sublime Text 3 本体

1. 安装 MinGW

1. 配置系统变量

1. 让 Sublime 变得更适合工作

	- 安装插件
     
   - 设置编译系统

---

## 下载 Sublime Text 3 本体

官方下载地址：[http://sublimetext.com/3](http://sublimetext.com/3)

选择 Windows 64 bit.

下载后运行，安装。

安装时记住安装目录，因为 Sublime Text 3 安装后不会在桌面生成快捷方式。

如果没有记住也无妨，你可以在开始菜单里找到 Sublime Text 3.

---

## 安装 MinGW

如果你的电脑上已经有了 C/C++ 的编译器，那么你不需要重新下载 MinGW.

在 Dev C++ 和 CodeBlocks 等软件的文件夹内，

都可以找到一个名为 MinGW 的文件夹。

这个文件夹就是我们需要的东西。

如果你的电脑上没有 MinGW，那么在下面的地址下载到最新版：

下载地址：[https://osdn.net/projects/mingw/releases/](https://osdn.net/projects/mingw/releases/)

下载按钮在左下角。

![](https://i.loli.net/2021/07/31/P9fndb4KtCswm8G.jpg)

下载好之后一路确定，

在之后的这个页面里，把这几个全打上勾

![](https://i.loli.net/2021/07/31/Zfivk2LDFbpYcox.jpg)

然后 Installation -> Apply Changes -> Apply

完成之后 Win+R -> cmd -> g++ -v

如果出现类似这样的版本信息，就证明安装成功了。

![](https://i.loli.net/2021/07/31/SVjlsBFf6cYINAy.jpg)

---

## 配置系统变量

右键 此电脑 -> 属性 -> 高级系统设置 -> 环境变量。

在下面一栏，也就是系统变量里，找到 Path，

在值里加入 MinGW 目录下，bin 文件夹的地址

例如，我把 MinGW 安装到了 C 盘根目录下，那么我需要加入：

```
C:\MinGW\bin;
```

如果系统是 Win7 还需要注意上一个值后面有没有分号，

如果前面没有分号，你需要先加入分号，再加入这个内容。

---

## 让 Sublime 变得更适合工作

打开 Sublime Text 3，按 Ctrl+Shift+P 

在出现的控制台里输入 Package Control，安装 Package Control.

安装过程中是看不到进度条的，不要以为你电脑卡了。

安装成功后会有提示。

再按 Ctrl+Shift+P 呼出控制台，输入 Package Control，

找到 Package Control: Install Package

![](https://i.loli.net/2021/07/31/LuYxvgEZOyk8dpM.jpg)

Enter之后会有几秒的寂寞。

输入 Chinese，安装 ChineseLocalizations.

过几秒安装完成就会变成中文界面。

还有很多对工作有用的插件都可以在这里找到。

之后是建立 C/C++ 的编译系统。

工具 -> 编译系统 -> 新建编译系统...

把以下内容原封不动地放在新文件里，替换掉原内容。

```yml
{
    "encoding": "utf-8",
    "working_dir": "$file_path",
    "shell_cmd": "g++ -Wall -std=c++11 \"$file_name\" -o \"$file_base_name\"",
    "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
    "selector": "source.c++",
    "shell": true,
 
    "variants":
    [
        {  
        "name": "Run in sublime",
            "shell_cmd": "g++ -Wall -std=c++11 \"$file_name\" -o \"$file_base_name\" && cmd /c \"${file_path}/${file_base_name}\""
        },
        {  
        "name": "CMD Run",
            "shell_cmd": "g++ -Wall -std=c++11 \"$file\" -o \"$file_base_name\" && start cmd /c \"\"${file_path}/${file_base_name}\" & pause\""
        }
    ]
}
```

Ctrl+S保存为 c++.sublime-build

写一个代码，Ctrl+Shift+B 选择刚才的编译系统 CMD Run

![](https://i.loli.net/2021/07/31/PCkqyXG3ESbjNJI.jpg)

配置/测试完成

以后需要编译+运行代码的时候，只需要按 Ctrl+B 即可。