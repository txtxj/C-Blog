---
title: "【题解】 P5020 【货币系统】"
date: 2019-02-07T23:50:45+08:00
math: md
tags: ["题解"]
cover: https://i.loli.net/2021/07/31/eZJwq8ChXcEytAx.jpg
grow: large
---

~~某凯的疑惑~~

看样例：

$$3, 10, 19, 6 \Leftrightarrow 3, 10$$ 

这是因为 

$$19 = 10 + 3 + 3 + 3, 6 = 3 + 3$$

看起来我们要把 **能够被其他钱凑出来的钱** 给筛掉，

这样一来剩下的就是我们必须要保留的面值了。

那我们可以建一个数组 ```mon[i]``` ，

来存 **面值为 i 的钱能不能被其它面值的钱凑出来** ，

最后再把整个 ```mon``` 跑一遍，

看看原货币系统中剩下几个不能被凑出来的钱，这就是答案了。

代码如下



```cpp
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <algorithm>
using namespace std;
int mon[25001] = {};
/*
mon[i] = 0 表示i面值的钱不能被凑出来
mon[i] = 1 表示i面值的钱可以被凑出来
mon[i] = 2 表示i面值的钱是货币系统中本来就有的钱
*/
int coins[101] = {};//存钱的面值
int T, n, ans = 0;
int main()
{
	scanf("%d ", &T);
	while (T--)
	{
		ans=0;
		memset(mon, 0, sizeof(mon));
		memset(coins, 0, sizeof(coins));
		scanf("%d", &n);
		for (int i = 1; i <= n; i++)
		{
			scanf("%d", coins + i);
			mon[coins[i]]=2;
		}
        //把货币系统中的钱标好
		sort(coins + 1, coins + 1 + n);
		for (int i = 1; i <= coins[n]; i++)
		{
			if (mon[i] > 0)
			//如果mon[i]能被凑出来
			//那么mon[i+coins[j]]也能被凑出来
			{
				for (int j = 1; j <= n; j++)
				{
					if (i + coins[j] <= coins[n]) //防止数组越界
					{
						mon[i + coins[j]] = 1;
					}
					else break; 
				}
			}
		}
		for (int i = 1; i <= coins[n]; i++)
		{
			if (mon[i] == 2) ans++;
		}
		printf("%d\n", ans);
	}
}
```
