---
title: "配置 Clash for Linux"
date: 2022-02-09T20:27:03+08:00
toc: true
math: md
tags: ["笔记"]
cover: https://s2.loli.net/2022/02/09/ElLMdJiOr98Igf2.jpg
grow: 
---

# 在 Ubuntu 20.04 中配置 Clash for Linux

之前一直在用 Windows ，用的梯子是不需要自己配置的。装了双系统之后一直苦于 Ubuntu 中 Github 等网站速度过慢。尝试了使用 [electron-ssr](https://github.com/qingshuisiyuan/electron-ssr-backup) ，但没找到靠谱的机场，后来在一个看起来不错的 Trojan 机场下面看见能用 Clash 托管，就换用 Clash 了。

## 下载 Clash

Clash 仓库地址：[https://github.com/Dreamacro/clash](https://github.com/Dreamacro/clash)

在 [Release](https://github.com/Dreamacro/clash/releases) 页面中下载最新的 gz 压缩包，我下载的版本为 [clash-linux-amd64-v1.9.0.gz](https://github.com/Dreamacro/clash/releases/download/v1.9.0/clash-linux-amd64-v1.9.0.gz) .

在 Terminal 中进入下载文件夹，解压压缩包

```shell
gunzip clash-linux-amd64-v1.9.0.gz
```

解压得到文件为 clash-linux-amd64-v1.9.0 ，为操作方便，可将其重命名为 clash

```shell
mv clash-linux-amd64-v1.9.0 clash
```

将其移动到一个单独的文件夹中

```shell
mkdir ~/clash
mv clash ~/clash
```

## 下载配置文件

进入刚创建的 clash 文件夹，为 clash 授予可执行权限，并运行

```shell
cd ~/clash
chmod +x clash
clash
```

程序将会提示缺少 config.yaml 和 Country.mmdb 两个配置文件，并自动开始下载，文件下载后位于 `~/.config/clash/` 中。

需要注意的是，如果安装的 Go 语言版本过低，在该步骤中可能会出现报错。需要按照如下方法卸载旧版本 Go 并安装至少 Go v1.17 。

``` shell
sudo apt-get remove golang
sudo apt-get remove golang-go
sudo apt auto remove
wget https://studygolang.com/dl/golang/go1.17.linux-amd64.tar.gz
tar -zxvf go1.17.linux-amd64.tar.gz -C /usr/lib
```

并添加环境变量

```shell
gedit /etc/profile
```

在最后添加

```shell
export GOPATH=/opt/gopath
export GOROOT=/usr/lib/go
export GOARCH=386
export GOOS=linux
export GOTOOLS=$GOROOT/pkg/tool
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
```

查询 Go 版本结果如下

```shell
txtxj@txtxj-Lenovo-Legion:~$ go version
go version go1.17 linux/amd64
```

## 获取订阅链接

在你使用的机场中复制 Clash 订阅，获得一个订阅链接，访问该链接下载得到一个 yaml 文件。

进入下载文件夹，将该文件重命名为 config.yaml ，并覆盖上一步中的 config.yaml 文件

```shell
mv ClashR_xxxxxxxxxx.yaml config.yaml
mv -f config.yaml ~/.config/clash
```

## 配置网络代理设置

访问 [clash.razord.top](http://clash.razord.top/) ，代理与端口、密钥分别对应 config.yaml 文件中的 `external-controller` 、 `secret` ，如果 `secret` 为空，则先设置一个密钥后再在网页端登录。

打开 设置 - 网络 - 网络代理，设置为手动。

根据网页端信息填写 HTTP 代理、 HTTPS 代理、 Socks 主机。

运行 Clash

```shell
~/clash/clash
```

 保持 Terminal 运行，即可正常访问国外网页。

## 设置快捷方式

在桌面创建快捷方式，以快速启动 Clash

```shell
gedit ~/桌面/clash.desktop
```

文件内容为

```shell
[Desktop Entry]
Name=Clash
Icon=/home/$username/clash/clash_logo.png
Exec="/home/$username/clash/clash" %u
Version=1.0
Type=Application
Terminal=false
StartupNotify=true
```

其中 clash_logo.png 为自行设置的快捷方式图标。
