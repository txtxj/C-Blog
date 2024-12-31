---
title: "HackerGame2022 WriteUP"
date: 2022-10-27T19:48:31+08:00
toc: true
math: md
tags: ["题解", "CTF"]
cover: https://s2.loli.net/2022/10/29/NjFDgTRwUaCiGQP.jpg
grow: mid
---

笔者本来是不打算参加今年 HackerGame 的（因为去年感觉好累，然后混了个 33 名，错失纪念衫），但是周六晚上看见群里好多人查航班，抱着来看看题目的心态点开了比赛链接，然后就一发不可收拾了。

笔者并没有网安、汇编方面的基础，数论更是一塌糊涂，只写了一部分题，在此记录一下写题过程中的思路。

## 签到

题目让签一个 2022 ，试了一下，第三个数字来不及画就结束了。

去看看网页源码，想着改一下时间限制，把时间放宽点再签。

![20221027_1.png](https://s2.loli.net/2022/10/29/CNDgrSQsfaWZH49.png)

但结果是不行的，时间限制还是没变，应该是因为四个画板的时间限制是在下面 `new Vue` 的时候设置的， `TIME_LIMIT` 数组只是个临时变量。

![20221027_2.png](https://s2.loli.net/2022/10/29/DURlG2XTZq6N1MP.png)

后来点了一下提交，看见 url 是 `http://202.38.93.111:12022/?result=2???` ，那就给他改成 `http://202.38.93.111:12022/?result=2022` 试试，成功拿到 flag。

看来是和去年一样的类型，直接在 url 上做手脚。

## 猫咪问答

考察搜索引擎使用能力的题目喵。

去年的猫咪问答让人答吐了喵，今年的猫咪问答要良心不少喵，甚至还有部分分喵。

> 中国科学技术大学 NEBULA 战队（USTC NEBULA）是于何时成立的喵？

直接必应搜索“中国科学技术大学 NEBULA 战队（USTC NEBULA）是于何时成立的喵？”

第一条结果就是喵

![20221027_3.png](https://s2.loli.net/2022/10/29/H1gc2huri6bnWJY.png)

> 2022 年 9 月，中国科学技术大学学生 Linux 用户协会（LUG @ USTC）在科大校内承办了软件自由日活动。除了专注于自由撸猫的主会场之外，还有一些和技术相关的分会场（如闪电演讲 Lightning Talk）。其中在第一个闪电演讲主题里，主讲人于 slides 中展示了一张在 GNOME Wayland 下使用 Wayland 后端会出现显示问题的 KDE 程序截图，请问这个 KDE 程序的名字是什么？

搜索“LUG @ USTC 闪电演讲 2022”喵，找到 lug 主页上的一篇新闻稿喵，但是里面没有提到题目问的信息喵。

继续在 lug 主页上搜索喵，找到“自由软件日”子页面喵，记录了历年的活动详情喵，包含 Slides 和回放喵。

![20221027_4.png](https://s2.loli.net/2022/10/29/epJVFL5GDmWqOv4.png)

先把 Slides 下载下来看看喵，可以推测出来题目是在问下面这一张中出现的截图是什么软件喵，但是截图上并没有显示软件名喵。

![20221027_5.png](https://s2.loli.net/2022/10/29/g79WbMlKI1tZcei.png)

再去看看回访喵，定位到 2:42:04 喵，听到 taoky 说了一个软件名喵，能听出来的几个音节是 k d live 或者 life 喵。去搜索“k d live”喵，第一条记录是 Kdenlive 喵，发音符合喵，去试了一下喵，是正确答案喵。

> 22 年坚持，小 C 仍然使用着一台他从小用到大的 Windows 2000 计算机。那么，在不变更系统配置和程序代码的前提下，Firefox 浏览器能在 Windows 2000 下运行的最后一个大版本号是多少？

直接搜索“Firefox 浏览器能在 Windows 2000 下运行的最后一个大版本号是多少”喵，出现“Firefox 13 不再支持 Windows 2000”喵。答案是 12 喵。

> 你知道 PwnKit（CVE-2021-4034）喵？据可靠谣传，出题组的某位同学本来想出这样一道类似的题，但是发现 Linux 内核更新之后居然不再允许 argc 为 0 了喵！那么，请找出在 Linux 内核 master 分支（torvalds/linux.git）下，首个变动此行为的 commit 的 hash 吧喵！

去 GitHub 找仓库 torvalds/linux 喵，仓库内搜索 PwnKit 喵，找到一条 Commit 记录喵，hash 值为 dcd46d897adb70d63e025f175a00a89797d31a43 喵。

> 通过监视猫咪在键盘上看似乱踩的故意行为，不出所料发现其秘密连上了一个 ssh 服务器，终端显示 ED25519 key fingerprint is MD5:e4:ff:65:d7:be:5d:c8:44:1d:89:6b:50:f5:50:a0:ce.，你知道猫咪在连接什么域名吗？

这一题是最后写的喵，完全没有头绪喵。因为题目提示了只有 6 个各不相同的字母喵，考虑到常用顶级域名也就 com org net 喵，就直接做了个 Python 程序暴力枚举了喵。

```python
q5 = [0, 0, 0, ord('o') - 97, ord('r') - 97, ord('g') - 97]


def generate_str():
	ret = ""
	for c in q5:
		ret += chr(97 + c)
	return ret[0:3] + "." + ret[3:]


s = requests.session()

while True:
	q5[0] += 1
	for i in range(5):
		if q5[i] >= 26:
			q5[i + 1] += 1
			q5[i] -= 26
	if q5[5] == 26:
		exit(0)
	ans["q5"] = generate_str()
	print(ans["q5"])
	res = s.post(url=url, headers=header, data=ans).content.decode('utf-8')
	soup = BeautifulSoup(res, 'html.parser')
	alert = soup.find_all(attrs={"class": "alert alert-success"})
	if len(alert) > 1:
		print(str(alert[1]).splitlines()[1].replace(" ", ""))
```

> 中国科学技术大学可以出校访问国内国际网络从而允许云撸猫的“网络通”定价为 20 元一个月是从哪一天正式实行的？

搜索“网络通 20元 site:ustc.edu.cn”喵，找到校内一条“关于实行新的网络费用分担办法的通知”喵。

通知中提到“网字〔2003〕1号《关于实行新的网络费用分担办法的通知》终止实行”喵。

在通知的附件 2 中可以看到新旧费用分担办法对比喵，可知旧的费用方案也是 20 元每月喵。

那就继续搜索“〔2003〕1号《关于实行新的网络费用分担办法的通知》 site:ustc.edu.cn”喵，找到一份古早的通知喵。

![20221027_6.png](https://s2.loli.net/2022/10/29/xKlVE62h9w3MpGg.png)

答案是 2003-03-01 喵。

## 家目录里的秘密

把压缩包下载，解压。

解压的时候提示“Can not create symbolic link : 客户端没有所需的特权”，

找到这么一个教程 <https://blog.csdn.net/shulianghan/article/details/123705737> ，跟着做一下就可以解压了。

解压完用 Everything 搜了一下，没发现 flag 。

猜测 flag 是在某个文件内部的角落里，需要对文件内容搜索。

直接在 GitHub 上开一个私有仓库，把整个家目录传上去，过一会就能直接用 GitHub 仓库内搜索功能了。

搜索 flag ，出现一条 Code 记录，直接交上去，是第一问的答案。

第二问提到 rclone ，找与 rclone 有关的文件，发现一个非常可疑的文件 `/.config/rclone/rlone.conf` ，里面包含了一串被加密过的密码 `tqqTq4tmQRDZ0sT_leJr7-WtCiHVXSMrVN49dWELPH1uce-5DPiuDtjBUN3EI38zvewgN5JaZqAirNnLlsQ` 。

去找这个密码怎么破译。 rclone 官网上有提到，这个密码并不是安全的加密方式 <https://rclone.org/commands/rclone_obscure/> 。

后来在 GitHub 上看到了这么一个仓库 <https://github.com/julianbrost/rclone-unobscure> 可以直接对 rclone 的密码进行解密。

仓库 README

> For some unknown reason, rclone obfuscates all passwords stored in its configuration file. To do so, it just encrypts the password with AES in counter mode using the static key 9c935b48730a554d6bfd7c63c886a92bd390198eb8128afbf4de162b8b95f638 (implemented in fs/config/obscure/obscure.go). This obviously does not add any security at all and is just annoying if you want to retrieve a password from the configuration for whatever reason.

> This little 5 line Go program will look for a rclone configuration in the standard locations (typically ~/.config/rclone/rclone.conf), decode the passwords and print them. To use it, just clone the repository, run go build and execute the resulting ./rclone-unobscure binary.

于是装了一个 Golang ，跑了一下这个代码，得到 flag 。

## HeiLang

是在是太酷辣！

讲真的，我第一眼看过去的时候还在想“Python 本身不就支持这种语法吗”。

把上面的赋值部分做成字符串，然后解析这个字符串给数组赋值，代码如下

```python
if __name__ == "__main__":
	for line in ss.splitlines():
		num_list = re.findall("\d+\.?\d*", line)
		for i in range(len(num_list) - 1):
			a[int(num_list[i])] = int(num_list[len(num_list) - 1])
	get_flag(a)
```

## Xcaptcha

一秒内计算三个高精度加法。

最开始是用 Python 做的，但是不知道为啥不行

```python
s = requests.session()
p = s.get(url=href, headers=headers).content.decode('utf-8')

ans = []

soup = BeautifulSoup(p, 'html.parser')
txt_list = soup.find_all("label")
for txt in txt_list:
	a = re.findall("\d+\.?\d*", txt.text)
	ret = int(a[0]) + int(a[1])
	if ret >
	ans.append()


params = {
	"captcha1": str(ans[0]),
	"captcha2": str(ans[1]),
	"captcha3": str(ans[2])
}

content = s.post(url=href, headers=headers, params=params).content.decode('utf-8')
```

答案放到 `params` 和 `data` 里面都试过了，但就是一直失败，遂转去写 JS 。

```javascript
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://202.38.93.111:10047/xcaptcha
// @icon         https://www.google.com/s2/favicons?sz=64&domain=93.111
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	// var highestTimeoutId = setTimeout(";");
	// for (var i = 0 ; i < highestTimeoutId ; i++) {clearTimeout(i); }
	var xs = document.getElementsByTagName("label");
	var ip = document.getElementsByTagName("input");
	for (var j = 0; j < 3; j++) {
		var txt = xs[j].textContent;
		var a = xs[j].textContent.split('+')[0];
		var b = xs[j].textContent.split('+')[1].split(' ')[0];
		console.log(BigInt(a)+BigInt(b));
		ip[j].value = BigInt(a)+BigInt(b);
	}
})();
```

打开网页，自动填写答案，得到 flag `flag{head1E55_br0w5er_and_ReQuEsTs_areallyour_FR1ENd_...}` 

（不过这题我用的是 browser ，不是 flag 里的 headless brower 啊。。。）

## 旅行照片

第一题直接把照片拖到 PS 里，得到答案：

2.31、小米、84、2022/05/14、否。

日期是最不可能出错的，也是卡了我最久的，我一直以为是 EXIF 版本号错了（因为 PS 看到的版本号是 0231 ，格式不对）。

后来发现是因为日期的 05 月写成了 5 月。

第二问？ 150 分查航班完全不值，不想写了。

## 猜数字

试着点了几下提交，发现它会自动帮你计算下一步二分的值，好贴心。

所以应该可以相信大数定理，用连点器什么的把答案点出来（误

把 Java 源码下载下来，刚好这学期学了一点 Java ，所以还能耐着性子把代码看一遍。

找到主要代码

```java
if (this.previous.isPresent()) {
	// <guess>
	var previous = this.previous.getAsDouble();

	var isLess = previous < this.number - 1e-6 / 2;
	var isMore = previous > this.number + 1e-6 / 2;

	writer.writeStartElement("guess");
	writer.writeAttribute("less", Boolean.toString(isLess));
	writer.writeAttribute("more", Boolean.toString(isMore));
	writer.writeCharacters(Double.toString(previous));
	writer.writeEndElement();
	// </guess>
}
if (this.talented > 0) {
	// <flag>
	writer.writeStartElement("flag");
	writer.writeCharacters(this.token.flag());
	writer.writeEndElement();
	// </flag>
}
```

看到只要 `talented > 0` 后续每次猜数字都会显示 flag ，所以这个题对连点器是友好的（确信

再去看看随机数生成的部分，想着能不能从预测随机数入手

```java
final Random RNG = new SecureRandom();

var guess = Double.parseDouble(event.asCharacters().getData());

var isLess = guess < this.number - 1e-6 / 2;
var isMore = guess > this.number + 1e-6 / 2;

var isPassed = !isLess && !isMore;
var isTalented = isPassed && this.previous.isEmpty();

var newPassed = isPassed ? this.passed + 1 : this.passed;
var newTalented = isTalented ? this.talented + 1 : this.talented;
var newNumber = isPassed ? RNG.nextInt(1, 1000000) * 1e-6 : this.number;
var newPrevious = isPassed ? OptionalDouble.empty() : OptionalDouble.of(guess);
```

用的是 `SecureRandom` ，看起来似乎很安全，没法预测。

这个时候注意到，上面两处的代码，都使用了一种奇怪的方式比较大小

```java
var isLess = guess < this.number - 1e-6 / 2;
var isMore = guess > this.number + 1e-6 / 2;
var isPassed = !isLess && !isMore;
```

为什么不直接 `var isPassed = guess == this.number * 1e6` 呢？

难道是因为精度？可是这个程序读入用户输入的时候是直接把输入的小数当成字符串，截取了小数部分当作一个整数来处理的，这里却用小数难道不是很可疑吗？

感觉出题人在这里做了手脚，于是笔者就在想怎么让 `isPassed` 变为 `true` 。

显然 `isLess` 和 `isMore` 都为 `false` 时。

那除了 `guess == this.number - 1e-6 / 2` ，还有其他方法让 `isLess` 和 `isMore` 都为 `false` 吗？

答案是：比较操作的两个操作数中出现 `NaN` 时，返回值为 `false` 。

浏览网页代码，找到函数 `change(value)` 和 `submit()` ，在控制台输入

```javascript
change(NaN)
submit()
```

得到 flag `flag{gu3ss-n0t-a-numb3r-1nst3ad-...}`

## LaTeX 机器人

把后端代码下载下来看一下，机器人原理是把用户输入的文本插入到下面这个 tex 文件的第 3 行和第 4 行之间。

```tex
\documentclass[preview]{standalone}
\begin{document}
$$
$$
\end{document}
```

先试着输入一个 `$$ \beta $$` ，返回解析失败。

因此这个题就应该用四个 `$` 把 base.tex 里的公式符号闭合，然后再进行各种奇怪的操作，得到 flag 。

去搜索“latex 包含文本文件” ，得知可以使用宏 `\input` 和 `\include` ，其中 `\include` 会导致换页，机器人截图看不到内容。

输入 `$$ \input{/flag1} $$` 得到 flag 。

![20221027_7.png](https://s2.loli.net/2022/10/29/HQ5L9X4myZV2UpJ.png)

完成第一问之后，笔者就去尝试第二问了，但是一直没能做出来。

这一题的第二问是笔者本次比赛做出来的最后一道题目。

首先，笔者完全不知道 `#` 在 Latex 中意味着什么，搜也没搜到。

后来在了解 Latex 宏的过程中终于搞明白 `#` 的功能是在宏内部表示这个宏接收的参数，例如 `#1` 表示这个宏的第 1 个参数，`#2` 表示这个宏的第 2 个参数。

但这并不能对解题起到帮助，该不会还是不会。

笔者又去 Google 了包括但不限于下列关键词：

- latex include plain text with escape chars
- latex verb include
- latex verbatim
- latex texttt
- latex listing
- latex verbatiminput
- latex ignore special chars escape chars
- latex usepackage in document
- latex multi document
- latex replace
- Embedded Latex(搜这个是受到了安全 OJ 那题的启发)
- latex commandchars
- How to include plain text with special chars
- ...

并且做了一个 Python 脚本方便上传 tex 语句

```python
import requests
from bs4 import BeautifulSoup

text = """ $$
\\newread\\recipientfile
\\openin\\recipientfile=/flag1
\\read\\recipientfile to\\email
\\closein\\recipientfile
\\texttt{\\email}
\\verb|\\email|
$$ """


print(text)

data = {
	"latex-text": text.replace("\n", " "),
}

url = "http://202.38.93.111:10020/"

ret = requests.post(url=url, headers=header, data=data).content.decode('utf-8')
soup = BeautifulSoup(ret, 'html.parser')
img_list = soup.find_all("img")
if len(img_list) > 0:
	print(str(img_list[0])[10:-3])
else:
	print("error")

```

经过无数次尝试与 error ，终于，在搜索“latex import text file with special characters site:tex.stackexchange.com” 时，找到了这个页面 <https://tex.stackexchange.com/questions/630044/how-can-i-input-multiple-txt-files-with-special-characters-into-my-main-tex-file>

倒数第二个回答是这样的

```tex
\documentclass{article}

\usepackage[T1]{fontenc}
\begin{document}

\section{File 2}
{
\catcode`\$=12
\catcode`\_=12
\catcode`\^=12
\catcode`\%=12
\catcode`\~=12
\input{file2.txt}
}

\end{document}
```

这个 `\catcode` 似乎对这些特殊符号进行了一个什么赋值操作。

于是笔者立刻去搜索这条宏，在 WIKIBOOKS 上找到解释：

> \catcode is the command that's used to change the category code of a character.

给出的例子展示了将 `@` 的 category code 改变为 11 ，也就是 Letter ，以实现直接输出 `@` 的功能，这正是我想要的。

于是修改上面 Python 代码，

```python
text = """ $$
\\catcode`\\#=11
\\catcode`\\_=11
\\input{/flag2}
$$ """
```

顺利输出 flag

![20221027_8.png](https://s2.loli.net/2022/10/29/sPYpVNUKEZnm6Bc.png)

图中的点是下划线，不知道为什么变成了这样的点。

## Flag 的痕迹

在基于 Dokuwiki 的 FlagWiki 上进行操作，和去年在数据库里找邮箱很像，因此首先想到在 url 后面加请求。

果然，点击 Media Manager 之后，url 变成了 `http://202.38.93.111:15004/doku.php?id=start&do=media&ns=` 。

去 Dokuwiki 官网上找可以看到历史记录的命令，一个一个试，发现大部分都被禁用了，但是 `diff` 可以用。

输入 `http://202.38.93.111:15004/doku.php?do=diff` ，往前一个版本，得到 flag

![20221027_9.png](https://s2.loli.net/2022/10/29/ceC4i2xSdDFMzmG.png)

## 安全的在线测评

从判题脚本可以看到数据的位置，直接做一个程序读取 `/data/static.out` 并输出

```c
#include <stdio.h>

int main()
{
	freopen("./data/static.out", "r", stdin);
	char c = getchar();
	while (c != EOF)
	{
		putchar(c);
		c = getchar();
	}
	return 0;
}
```

拿到第一个 flag `flag{the_compiler_is_my_eyes_20ee4a8a38}`

看到第一个 flag 的时候，笔者还以为这个 flag 内容是第二问的提示，现在看来应该是第一问笔者做了个非预期解。

不过这个 flag 确实对做第二问有帮助。

后来笔者想通过相同的方法通过动态数据，但是发现动态数据的文件是没有读取权限的。

观察给出的判题脚本，发现编译的时候使用的是

```python
p = subprocess.run(
	["gcc", "-w", "-O2", SRC, "-o", BIN],
	stdout=sys.stdout,
	stdin=subprocess.DEVNULL,
	stderr=subprocess.STDOUT
)
```

执行的时候使用的是

```python
p = subprocess.run(
	["su", "runner", "-c", path],
	input=input,
	stdout=subprocess.PIPE,
	stderr=subprocess.STDOUT,
	timeout=timeout
)
```

因此执行过程中没有权限读取输出文件。

那编译的时候有权限查看吗？试一下

```c
int main()
{
	int a = 
		#include "../data/dynamic0.out"
	return 0;
}
```

发现果然能输出文件内容

![20221027_10.png](https://s2.loli.net/2022/10/29/WvMVSsXuPa4EjfH.png)

这时才意识到第一问的 flag 是什么意思：

预期解应该是用编译器去看静态数据，然后重写一个程序输出，因此 flag 内容才是“编译器是我的眼”。

那动态数据如何处理呢，用 `include` 可以把数据导入，用 `define` 可以把字面值变为字符串，但是这两者不能合在一起用。

又经过了漫长的搜索，再知乎上发现了这样一篇回答 <https://www.zhihu.com/question/431645051/answer/1826562458> ，试了一下，完美符合要求。

做出如下程序

```c
#include <stdio.h>

#define EMBED_STR(name, path)                \
  extern const char name[];                  \
  asm(".section .rodata, \"a\", @progbits\n" \
	  #name ":\n"                            \
	  ".incbin \"" path "\"\n"               \
	  ".byte 0\n"                            \
	  ".previous\n");

EMBED_STR(static_out, "./data/static.out");
EMBED_STR(dynamic0_out, "./data/dynamic0.out");
EMBED_STR(dynamic1_out, "./data/dynamic1.out");
EMBED_STR(dynamic2_out, "./data/dynamic2.out");
EMBED_STR(dynamic3_out, "./data/dynamic3.out");
EMBED_STR(dynamic4_out, "./data/dynamic4.out");
EMBED_STR(static_in, "./data/static.in");
EMBED_STR(dynamic0_in, "./data/dynamic0.in");
EMBED_STR(dynamic1_in, "./data/dynamic1.in");
EMBED_STR(dynamic2_in, "./data/dynamic2.in");
EMBED_STR(dynamic3_in, "./data/dynamic3.in");
EMBED_STR(dynamic4_in, "./data/dynamic4.in");

typedef struct loong{
	int arr[3600];
	int length;
} loong;

loong CONST0;

void init()
{
	CONST0.length = 0;
	for (int i = 0; i < 3600; i++)
	{
		CONST0.arr[i] = 0;
	}
}

loong scan()
{
	char c = getchar();
	loong ret = CONST0;
	while (c >= '0' && c <= '9')
	{
		ret.arr[ret.length] = c - '0';
		c = getchar();
		ret.length += 1;
	}
	for (int i = 0, j = ret.length - 1; i < j; i++, j--)
	{
		ret.arr[i] ^= ret.arr[j];
		ret.arr[j] ^= ret.arr[i];
		ret.arr[i] ^= ret.arr[j];
	}
	return ret;
}

loong scan_from_str(const char* str)
{
	int index = 0;
	char c = str[index++];
	loong ret = CONST0;
	while (c >= '0' && c <= '9')
	{
		ret.arr[ret.length] = c - '0';
		c = str[index++];
		ret.length += 1;
	}
	for (int i = 0, j = ret.length - 1; i < j; i++, j--)
	{
		ret.arr[i] ^= ret.arr[j];
		ret.arr[j] ^= ret.arr[i];
		ret.arr[i] ^= ret.arr[j];
	}
	return ret;
}

int eq(loong a, loong b)
{
	if (a.length != b.length) return 0;
	for (int i = 0; i < a.length; i++)
	{
		if (a.arr[i] != b.arr[i])
		{
			return 0;
		}
	}
	return 1;
}

int main()
{
	loong input = scan();
	loong s = scan_from_str(static_in);
	loong d0 = scan_from_str(dynamic0_in);
	loong d1 = scan_from_str(dynamic1_in);
	loong d2 = scan_from_str(dynamic2_in);
	loong d3 = scan_from_str(dynamic3_in);
	loong d4 = scan_from_str(dynamic4_in);
	if (eq(input, s))
	{
		puts(static_out);
	}
	else if (eq(input, d0))
	{
		puts(dynamic0_out);
	}
	else if (eq(input, d1))
	{
		puts(dynamic1_out);
	}
	else if (eq(input, d2))
	{
		puts(dynamic2_out);
	}
	else if (eq(input, d3))
	{
		puts(dynamic3_out);
	}
	else if (eq(input, d4))
	{
		puts(dynamic4_out);
	}
	return 0;
}
```

提交，得到 flag `flag{cpp_need_P1040_std_embed_...}` 

## 线路板

送分题，安装一个 Altium Designer ，在某个板子上能看到 flag 字样，把后面的那些圆环一个一个删掉就能看到 flag 。

![20221027_11.png](https://s2.loli.net/2022/10/29/bWUtEfQvoPVuXZe.png)

## Flag 自动机

萌新的第一次逆向，不过这个题很友好，输出 flag 的函数都不对输入值做要求。

先打开程序，有狠心夺取和放手离开两个按钮。

![20221027_12.png](https://s2.loli.net/2022/10/29/OqcHsBltNbjCrfM.png)

鼠标移动到狠心夺取上的时候按钮会随机移动到其他位置，点击放手离开则程序关闭。

打开 IDA 开始逆向，F5 出伪代码。

先看一下 `_WinMain@16` 函数，把里面那些粉紫色的函数拿去搜一下，了解到这是个 WinAPI 程序。

![20221027_13.png](https://s2.loli.net/2022/10/29/pnazNBTuKCGqPQV.png)

再把那些 `sub` 函数挨个看一遍，找到一个可疑的函数 `sub_401510` ，里面写了个 `switch` 对传入的 `Msg` 进行处理。

![20221027_14.png](https://s2.loli.net/2022/10/29/NuaFLdS8xbr42zA.png)

当满足某些条件时，输出 `Congratulations` ，并把 flag 输出到 `flag_machine.txt` 中。

直接把最外面这个跳转改到 `loc_401840` 的位置（即打印 flag 的位置），运行程序。

![20221027_15.png](https://s2.loli.net/2022/10/29/wn16qKQLYvhHzrO.png)

结果程序弹窗“恭喜获得 flag ”（并且弹窗关不掉），同时有一个 `flag_machine.txt` 文件出现。

但是打开该文件后发现里面是乱码，只能依稀辨别出来 f l g \{ 这四个字符。

估计是这个改法太暴力了，需要换一种更优美的方式。

但是后来笔者有试了很多暴力的改法，包括但不限于修改从进入 `sub_401510` 后到输出 flag 前的每一次跳转的位置，但都没有成功。

又看到 `sub_401510` 函数在处理 `case 1u` 的时候，似乎生成了一些窗体或者组件，那能否通过调换生成组件的详情信息，来调换两个按钮的功能呢？

虽然笔者当时是那么想的，但是实力不够，也没有改成功。

无奈，去查阅 WinAPI 的官方文档，文档给出了 `sub_401510` 这个函数的标准写法，以及不同 `Msg` 对应的含义。

这时笔者才意识到伪代码中的 `2u` `0x111u` `1u` 应当是一些宏，而不是用户规定的数字。

其中 `2u` 表示接受到关闭信息（窗体标题栏的关闭按钮被按下），`0x111u` 表示接受到交互信息（比如按钮组件被按下），`1u` 表示创建窗体（即初始化）。

而 `a3` 则是窗体内组件的编号。

于是笔者就去把 `case 1u` 里面前两个窗体组件（推测是两个按钮）的 `HMENU` 值对调了一下，然而什么都没有发生。

后面又进行了一些类似的操作，又都以失败告终了。

笔者决定换换思路，就去找别的函数来看，发现了另外一个可疑的函数 `pfnSubclass` ，这个函数里有 `rand` ，而且这个函数明显是在调整按钮的位置（为什么没有早一点发现。。。）

![20221027_16.png](https://s2.loli.net/2022/10/29/yTS6DLu8znbWkvw.png)

把 `if` 的条件改成其他值，使其不能成功（其实最开始是想给 `SetWindowPos` 传固定值，但是又不知道为啥失败了）。

终于，按钮不再乱动了，但是：

![20221027_17.png](https://s2.loli.net/2022/10/29/mbycOq8Dk43GQwU.png)

好吧，看来这个是和 `114514` 有关的，那就把 `sub_401510` 里对 `lParam == 114514` 的判断跳转从 `jz` 改为 `jnz` ，再运行程序，拿到 flag `flag{Y0u_rea1ly_kn0w_Win32API_...}` 。

![20221027_18.png](https://s2.loli.net/2022/10/29/HdnNql1T9jh2yrP.png)

题到这里是写完了，但是还有问题。

`sub_401F8A` 在解码 flag 的时候需要传入一个参数，在 `lParam == 114514` 的情况下，这个参数固然是 `114514` ，但是在修改了上述逻辑之后，传入的参数是不可知的。

如果 `sub_401F8A` 函数在解码 flag 的过程中，需要这个值作为密钥，那么还需要修改程序使得传入的值是 `114514` ，否则应当解码出乱码。

而这个题并没有做这样的要求，出题人还是仁慈了。。。

另外： IDA 好难用，用修补程序里面的“汇编”操作修改操作数后，打补丁的时候显示 Patch 0/0 ，

即 IDA 没把“修补程序-汇编”操作做的修改真正修补到程序中，只有通过“单字节”、“双字节”做的修改才会被打入程序中。

这就导致前几天做这个题的时候，好多常数修改其实都没修改成功，程序自然也就跑得奇奇怪怪的。

## 微积分计算小练习

先看看前端，有一个表单，可以提交姓名和答案，提交之后跳转到另一个页面，并且姓名会显示出来。

再去看后端，用 webdriver 浏览了一个秘密网页，在 cookie 里放了个 flag ，然后又去访问了成绩页面，并且打印 `greeting` 和 `score` 。

因此首先想到的是把 cookie 放在 `greeting` 或者 `score` 里面，然后输出，火速做出了如下代码

```javascript
greeting = document.getElementById('greeting');
greeting.innerHTML=`${document.cookie}`;
```

放到浏览器控制台里试了一下，发现可行，但是要怎么注入呢？

先试了一下把上面代码放到表单的名字那里

```javascript
<script>
	greeting = document.getElementById('greeting');
	greeting.innerHTML=`${document.cookie}`;
<\script>
```

提交之后看 F12 ，代码确实提交上去了，但是似乎没有运行，代码颜色是黑色的，可能甚至没有被解析。

![20221027_19.png](https://s2.loli.net/2022/10/29/z1LhkKUrVJbym6Q.png)

去搜了一下“js注入，script没有被解析”，找到这一篇文章，提到前后端分离的方式可以避免这种注入。

<https://blog.csdn.net/qq_41914181/article/details/109131138>

那还能怎么注入？又试了一下向后端提交链接

```
javascript:{greeting=document.getElementById('greeting');greeting.innerHTML=`${document.cookie}`;}
```

结果提示 `JavaScript Error: Did you give me correct URL?` 

推测可能是刚开始访问的秘密链接里面没有 `greeting` 这个元素，就又尝试着在代码里创建这个元素，再把 cookie 写进去，也以失败告终。

于是笔者去搞了个 chromedriver ，在本机试了一下。

发现问题出在 webdriver 对 JS 命令进行 Get 操作的时候，浏览器会直接关闭，然后抛出异常。

这下地址栏 JS 注入也不管用了，无奈，继续去搜索“JS 注入 innerHTML”，找到了这样一篇文章

<https://blog.csdn.net/jimmyleeee/article/details/123003548>

去试一下，提交以下姓名

```javascript
<img src=x onerror={greeting=document.getElementById('greeting');greeting.innerHTML=`${document.cookie}`;}>
```

成功拿到 flag `flag{xS5_1OI_is_N0t_SOHARD_...}` 

（又学到了新知识，准备去 xls 的博客上玩玩注入

（玩完回来了，xls 的博客直接把 `onerror` 部分给删掉了

## 杯窗鹅影

这个题题目那么长，又是纯纯的 nc 题目，还打着 binary 标签，看一眼就觉得劝退。

但是试了一下第一题，意外的简单。

第一个 flag 位于 `/flag1` ，直接 `freopen` 打开输出，拿到第一个 flag `flag{Surprise_you_can_directory_traversal_1n_WINE_...}`

```c
int main(int argc, char** argv)
{
	freopen("/flag1", "r", stdin);
	char c = getchar();
	while (c != EOF)
	{
		putchar(c);
		c = getchar();
	}
	return 0;
}
```

第二个 flag 位于 `/flag2` ，但要执行 `/readflag` 才能读到，先试一下直接读，输出为空，但是没有报错。

用 `access` 测试了一下文件存在状态与权限，发现 `/flag2` `/readflag` 都是可读且可执行，很奇怪。

```c
void test_file(char* str)
{
	if (!access(str, F_OK))
	{
		printf("%s exist!\n", str);
	}
	if (!access(str, R_OK))
	{
		printf("%s can read!\n", str);
	}
	if (!access(str, X_OK))
	{
		printf("%s can exec!\n", str);
	}
}
```

用二进制方式读取 `/flag2` 输出还是空，怀疑这个文件里根本没有东西，第二个 flag 是写死在 `/readflag` 里面的。

那就只能去看看 `/readflag` 了。

按二进制格式输出一下这个程序，把输出结果保存到本地，保存为可执行文件执行一下，结果报错无法运行。

推测这个程序比提供的输出长度最大值要大，没法完整输出，这条路走不通。

既然 `/readflag` 可执行，那就用 `execl` 执行试一下，

```c

int ret = execl("/readflag", NULL);
if (ret != 0)
{
	printf("%d: %s\n", ret, strerror(errno));
}
```

结果输出 `No such file or directory` ，把地址换成 `./readflag` `readflag` 等等，都找不到文件。

搞不懂 `execl` 的寻址究竟是怎么回事（也可能是 Wine 的问题？），试着输出了一下当前程序的路径，

```c
printf("%s\n", argv[0]);
```

结果出来了 `\\?\unix\dev\shm\a.exe`

鉴于在程序内可以使用 `access` 测试文件权限，推测 `a.exe` 和 `readflag` 位于相同目录下，因此做如下修改

```c
int main(int argc, char** argv)
{
	argv[0][9] = 'r';
	argv[0][10] = 'e';
	argv[0][11] = 'a';
	argv[0][12] = 'd';
	argv[0][13] = 'f';
	argv[0][14] = 'l';
	argv[0][15] = 'a';
	argv[0][16] = 'g';
	argv[0][17] = 0;
	int ret = execl(argv[0], NULL);
	if (ret != 0)
	{
		printf("%d: %s", ret, strerror(errno));
	}
	return 0;
}
```

成功输出 flag `flag{W1ne_is_NeveR_a_SaNDB0x_...}`

看这个题解出来的人数并不多，甚至解出第一问的人数比解出 Latex 机器人第二问的人还少，

可能大家都是被题面吓到了罢。。。

## 蒙特卡罗轮盘赌

又是猜数字，先看看代码

```c
srand((unsigned)time(0) + clock());

for (int j = 0; j < N; j++) {
	double x = rand01();
	double y = rand01();
	if (x*x + y*y < 1) M++;
}
```

好家伙，直接不用 `SecureRandom` 了（C 应该也没有这玩意），那这不直接预测一手？

查了一下， `rand` 应该是有周期的，跑一下

```c
#include <stdio.h>
#include <stdlib.h>

#define SEED_MAX RAND_MAX

int map[SEED_MAX] = {};

int main()
{
	for (int i = 0; i < SEED_MAX; i++)
	{
		srand(i);
		map[i] = rand(i);
		if (i > 0 && map[i] == map[0])
		{
			printf("%d\n", i);
			break;
		}
	}
	return 0;
}
```

输出 `30103` ，很小，做一个程序把所有情况输出就好了。

```c
#include <stdio.h>
#include <stdlib.h>

#define SEED_MAX 30103

double rand01()
{
	return (double)rand() / RAND_MAX;
}

int main()
{
	FILE* f = fopen("../ans.txt", "w");
	int games = 5;
	for (int i = 0; i < SEED_MAX; i++)
	{
		srand(i);
		printf("%d\n", i);
		fprintf(f, "%d: ", i);
		for (int j = 0; j < games; j++)
		{
			int M = 0;
			int N = 400000;
			for (int k = 0; k < N; k++)
			{
				double x = rand01();
				double y = rand01();
				if (x*x + y*y < 1) M++;
			}
			double pi = (double)M / N * 4;
			fprintf(f, "%1.5f ", pi);
		}
		fprintf(f, "\n");
	}
	return 0;
}

```

跑了十多分钟，出了所有结果，开开心心地去答题，结果随机数序列全都对不上。

难道是 Debian:11 的 `rand` 和 Windows 的 `rand` 不一样？

于是笔者又废了老大劲，给自己的 Windows 10 家庭版装了 Hyper-V 和 Docker ，跑了一下 Debian:11 。

这里不得不提一句，JetBrains 真的好用，装完 Docker ，换完源，只需要在 Clion 里点一下运行，剩下的只需要等 Dockerfile 自己跑完就行了（貌似不用 IDE 也能做到，但是不听，JetBrains 就是好用，不接受反驳）。

在 Debian:11 里运行上面的测周期的函数，结果输出 `1` 。

果然，`rand` 在两平台上执行结果是不一样的，而且 `rand` 在 Debian:11 上究竟有没有周期都难说。

输出一下 `RAND_MAX` 竟然是 `0x7fffffff` ，这下无论如何都跑不完所有情况了。

重新看猜数字程序。

```c
srand((unsigned)time(0) + clock());
```

`time(0)` 是从 Unix 标准时间戳到现在的时间，这个在不同机器上都一样，`clock()` 是程序开始到执行这条语句时的用时，单位是毫秒，这个值应该不大。

所以只要输出 `time(0)` 附近的随机数种子跑出来的结果，就能预测答案了。

把上面的程序稍作修改

```c
#include <stdio.h>
#include <stdlib.h>

double rand01()
{
	return (double)rand() / RAND_MAX;
}

int main()
{
	FILE* f = fopen("../ans.txt", "w");
	int games = 5, SEED_MIN, SEED_MAX;
	printf("Input seed min:");
	scanf("%d", &SEED_MIN);
	printf("Input seed max:");
	scanf("%d", &SEED_MAX);
	for (int i = SEED_MIN; i < SEED_MAX; i++)
	{
		srand(i);
		printf("%d\n", i);
		fprintf(f, "%d: ", i);
		for (int j = 0; j < games; j++)
		{
			int M = 0;
			int N = 400000;
			for (int k = 0; k < N; k++)
			{
				double x = rand01();
				double y = rand01();
				if (x*x + y*y < 1) M++;
			}
			double pi = (double)M / N * 4;
			fprintf(f, "%1.5f ", pi);
		}
		fprintf(f, "\n");
	}
	return 0;
}

```

跑了一下种子 `1666790000 ~ 1666799999` 再去交，成功预测，拿到 flag 。

## 置换魔群

写完 WP 之后闲着没事又去开了两道数学题。

因为去年 Hackergame 做过 RSA 相关的题目，看到第一问还是比较亲切的。

题目意思梳理一下：

已知 $n, e, secret^e$ ，其中 $512 \le n < 1024, e = 65537(\mathrm{is\ prime}), secret \in A_n$ ，求 $secret$

在 RSA 中，加密和解密使用的式子：

$$
c = m^e \mod n\\\\
m = c^d \mod n
$$

也即 $(m^{e})^d = m \mod n$ 。

这个题也是一样，找到一个 $d$ ，使得 $(secret^{e})^d = secret$ 即可。

换言之，记 $fac$ 为 $secret$ 的阶，即 $secret^{fac} = I_n$ ，那么 $de = k\times fac + 1$ 。

如果 $secret^{e}$ 的阶为 $f$ ，即 $f$ 是满足 $secret^{ef} = I_n$ 的最小正数，由于 $e$ 是素数且 $e > n$ ，那么 $f$ 一定是 $fac$ 的整数倍。

因此问题转化为求 $secret^{e}$ 的阶 $f$ ，然后枚举 $k$ 求出 $d = (kf + 1)/e$ 的整数解，那么答案就是 $(secret^{e})^{d}$。

首先笔者常数了暴力枚举 $f$ ，结果 $n > 100$ 就跑不动了。

考虑到一次置换可以拆成若干个不可再拆的小置换，求原置换的阶 $f$ ，实际上就是求让所有小置换均进行 $f$ 次后，刚好全部变为 $I$ 。

而这些不可再拆的小置换的阶，正是它们的长度。

求所有不可再拆的小置换的长度的最小公倍数，即可得到原置换的阶。

代码如下

```python
import numpy
from permutation_group import permutation_element


def gcd_many(s):
    g = 0
    for i in range(len(s)):
        if i == 0:
            g = s[i]
        else:
            g = numpy.math.gcd(g, s[i])
    return g


def lcm_many(s) -> int:
    gcd = gcd_many(s)
    ret = 1
    for num in s:
        ret *= num / gcd
    return int(ret)


e = 65537
secrete = []

S = permutation_element(len(secrete), secrete)
SS = S.standard_tuple
res = []
for m in SS:
    res.append(len(m))

fac = lcm_many(res)

I = S**0
SI = S**fac

assert SI == I

print("res = ", res)
nfac = fac + 1
while nfac % e != 0:
    nfac += fac
    print("nfac: ", int(nfac))

d = int(nfac / e)
print(d)

sol = S**d
sss = ""

for x in sol.permutation_list:
    sss += str(x) + " "

print(sss)

```

`tty` 对每行输入的长度有限制，导致直接用 `list` 输出 `sol` 答案长度会超，被截断，这个问题困扰了笔者好久。。。

## 光与影

点开一看，WebGL ，这我熟悉。

渲染出来结果是 flag 四个字母，然后后面的内容被一个板子挡住了。

直接把网页连带着四个 JS 代码下载到本地。

先看看两个 Shader ，`vertexShader` 里没什么好看的，跳过。

`fragmentShader` 里面有好几个非常可疑的 `SDF` 函数，并且在 `sceneSDF` 函数中看到这些 `SDF` 函数被调用，

```c
float sceneSDF(vec3 p, out vec3 pColor) {
	pColor = vec3(1.0, 1.0, 1.0);
	
	vec4 pH = mk_homo(p);
	vec4 pTO = mk_trans(35.0, -5.0, -20.0) * mk_scale(1.5, 1.5, 1.0) * pH;
	
	float t1 = t1SDF(pTO.xyz);
	float t2 = t2SDF((mk_trans(-45.0, 0.0, 0.0) * pTO).xyz);
	float t3 = t3SDF((mk_trans(-80.0, 0.0, 0.0) * pTO).xyz);
	float t4 = t4SDF((mk_trans(-106.0, 0.0, 0.0) * pTO).xyz);
	float t5 = t5SDF(p - vec3(36.0, 10.0, 15.0), vec3(30.0, 5.0, 5.0), 2.0);
	
	float tmin = min(min(min(min(t1, t2), t3), t4), t5);
	return tmin;
}
```

很容易联想到，这些 `SDF` 里面有一个是用来遮挡 flag 内容的。

把五个 `SDF` 依次去掉测试，发现 `t5SDF` 即为遮挡物，得到 flag

![20221027_20.png](https://s2.loli.net/2022/10/29/wlM5IbyA69BKJGW.png)

## 量子藏宝图

写完 WP 回来之后做的第一个 math 。

先去搜 BB84 的量子密钥分发协议，看到知乎上有篇文章挺详细的 <https://zhuanlan.zhihu.com/p/22474140>

大致了解 BB84 之后就能知道，第一问填写制备基底和量子态，然后对方给出测量基底。

测量基底中和制备基底相同的位置保留，不相同的位置舍弃。

密钥就是保留下来的位置对应的量子态。

为了方便，制备基底选择 512 个 `+` ，量子态选择 512 个 `0` 。

得到测量基底后，统计测量基底中含有多少个 `+` ，就保留多少个 `0` 作为安全密钥。

开启第二问，给出了一张量子电路图，提示是 Bernstein-Vazirani 算法，并且给出了一个参考链接。

![20221027_21.png](https://s2.loli.net/2022/10/29/xXsuOhEelR9P8q1.png)

去搜了一圈 Bernstein-Vazirani 算法，看到似乎可以直接使用 QPanda 或者 Qiskit 代码把电路图画出来然后运行得到结果。

于是就开始了漫长的配环境之路，笔者最开始选择了 QPanda ，结果被 FreeStyle Matplot 等库橄榄了。

白忙活了俩小时之后又去投奔 Qiskit ，做出如下代码（门全部手动输入，不然还能做个识图程序直接把图转代码？）

```python
# initialization
import matplotlib.pyplot as plt
import numpy as np

# importing Qiskit
from qiskit import IBMQ, Aer
from qiskit.providers.ibmq import least_busy
from qiskit import QuantumCircuit, ClassicalRegister, QuantumRegister, transpile, assemble

# import basic plot tools
from qiskit.visualization import plot_histogram

n = 128 # number of qubits used to represent s

# We need a circuit with n qubits, plus one auxiliary qubit
# Also need n classical bits to write the output to
bv_circuit = QuantumCircuit(n + 1, n)

# put auxiliary in state |->
bv_circuit.h(n)
bv_circuit.z(n)

# Apply Hadamard gates before querying the oracle
for i in range(n):
    bv_circuit.h(i)

# Apply barrier
bv_circuit.barrier()

# Apply the inner-product oracle
bv_circuit.cx(0, n)
bv_circuit.z(4)
bv_circuit.x(6)
bv_circuit.x(15)
bv_circuit.z(30)
bv_circuit.x(38)
bv_circuit.x(40)
bv_circuit.x(44)
bv_circuit.x(46)
bv_circuit.x(70)
bv_circuit.x(90)
bv_circuit.x(92)
bv_circuit.z(96)
bv_circuit.z(121)
bv_circuit.x(123)
bv_circuit.cx(2, n)
bv_circuit.z(6)
bv_circuit.x(15)
bv_circuit.x(40)
bv_circuit.x(46)
bv_circuit.x(70)
bv_circuit.x(90)
bv_circuit.z(96)
bv_circuit.z(121)
bv_circuit.x(123)
bv_circuit.cx(3, n)
bv_circuit.cx(4, n)
bv_circuit.z(4)
bv_circuit.cx(5, n)
bv_circuit.cx(6, n)
bv_circuit.z(6)
bv_circuit.cx(8, n)
bv_circuit.x(6)
bv_circuit.cx(9, n)
bv_circuit.cx(13, n)
bv_circuit.cx(14, n)
bv_circuit.cx(16, n)
bv_circuit.cx(19, n)
bv_circuit.cx(20, n)
bv_circuit.cx(21, n)
bv_circuit.cx(24, n)
bv_circuit.cx(26, n)
bv_circuit.cx(29, n)
bv_circuit.cx(30, n)
bv_circuit.z(30)
bv_circuit.cx(34, n)
bv_circuit.cx(37, n)
bv_circuit.cx(38, n)
bv_circuit.x(38)
bv_circuit.cx(44, n)
bv_circuit.x(44)
bv_circuit.cx(45, n)
bv_circuit.cx(48, n)
bv_circuit.cx(52, n)
bv_circuit.cx(53, n)
bv_circuit.cx(56, n)
bv_circuit.cx(58, n)
bv_circuit.cx(61, n)
bv_circuit.cx(62, n)
bv_circuit.cx(64, n)
bv_circuit.cx(66, n)
bv_circuit.cx(68, n)
bv_circuit.cx(69, n)
bv_circuit.cx(72, n)
bv_circuit.cx(73, n)
bv_circuit.cx(76, n)
bv_circuit.cx(77, n)
bv_circuit.cx(80, n)
bv_circuit.cx(85, n)
bv_circuit.cx(86, n)
bv_circuit.cx(88, n)
bv_circuit.cx(89, n)
bv_circuit.cx(91, n)
bv_circuit.cx(92, n)
bv_circuit.x(92)
bv_circuit.cx(93, n)
bv_circuit.cx(94, n)
bv_circuit.cx(96, n)
bv_circuit.cx(97, n)
bv_circuit.cx(98, n)
bv_circuit.cx(101, n)
bv_circuit.cx(102, n)
bv_circuit.cx(104, n)
bv_circuit.cx(109, n)
bv_circuit.cx(110, n)
bv_circuit.cx(114, n)
bv_circuit.cx(115, n)
bv_circuit.cx(117, n)
bv_circuit.cx(118, n)
bv_circuit.cx(121, n)
bv_circuit.cx(122, n)
bv_circuit.cx(125, n)
bv_circuit.cx(126, n)

# Apply barrier
bv_circuit.barrier()

# Apply Hadamard gates after querying the oracle
for i in range(n):
    bv_circuit.h(i)

# Measurement
for i in range(n):
    bv_circuit.measure(i, i)

# bv_circuit.draw(output='mpl', filename='my_circuit.png')

# use local simulator
aer_sim = Aer.get_backend('aer_simulator')
shots = 1024
qobj = assemble(bv_circuit)
results = aer_sim.run(qobj).result()
answer = results.get_counts()

print(answer)

```

跑出来

```
{'01100110011011000110000101100111011110110110000100110011001101010110010100110001001100000110010001100101001110010110001101111101': 1024}
```

把这串数拿去按照 ASCII 解码，得到 flag `flag{a35e10de9c}`

## 企鹅拼盘

刚开始完全没看懂题目，点进去就做第一题。

输入四位 01 串？遍历一下所有情况，答案 `1000` ，得到 flag `flag{it_works_like_magic_...}`

第二题，输入十六位 01 串，手动枚举到比赛结束也搞不完，nc 又不会用，就没再搞。

## 火眼金睛的小E

第一问确实是有手就行。

经历了为写题而安装 IDA 、Altium Designer 、 Docker 、 Webdriver、 Golang 后，笔者已经对安装新软件无所畏惧了。

因此直接去下载了 Bindiff （不过当时被版本问题困扰了好久。

从网上随便找一个 Bindiff 教程，跟着做就完事了。

唯一的问题就是有时候 Bindiff 会给出错误的匹配，

比如告诉我 `0x2ee4` 和 `0x3a42` 是一对，但他们相似度只有 0.01 。

这种情况下，就去看 `0x3a42` 附近的函数，有没有相似度为 0.01 附近的，如果有，那么答案大概率就是它了。

另外还遇到过一个问题，就是题目指出的地址可以在 IDA 中看到，但那并不是函数，而是一个跳转的目标位置，

而且 Bindiff 也没有将其识别为函数。

遇到上面的情况，那就刷新重做咯，多试几次，总能通过的。

然后到了第二题，100 组文件，限时 60 分钟，答对 40 组，写不了，告辞。

## 后记

比赛第一天，拿了 500 分，一直到比赛第三天还没上 1000 分。

当时感觉题目好难，不想写了，好几道题都是有一点思路，但思路不多。

后面摆了大概一天，期间会有一些胡思乱想，于是后面开始疯狂搜索，学了不少新东西，逐渐把之前有一点点思路的题都给通过了。

感觉这次比赛的很多题目并不是在考察知识掌握程度，而是在考察搜索引擎熟练程度，很多知识现搜现用就能解题。

另外前十合影留念：

![20221027_22.png](https://s2.loli.net/2022/10/29/WomhX65NVvC9gzU.png)

（不过只坚持了俩小时就掉出去了，截至本文完成时 3650 分，组内 12 名）

（写完 WP 又去做了两道 math ，结束时 4150 分，喜提组内 17 名）