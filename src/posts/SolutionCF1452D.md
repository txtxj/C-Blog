---
title: "【题解】 CF1452D Radio Towers"
date: 2021-08-02T06:37:00+08:00
tags: ["题解"]
cover: "https://s2.loli.net/2021/12/22/xhVLAFBjoZwySpW.jpg"
grow: large
---

cyz好兄弟上了大学一直在刷题打比赛，

某日忘了概率怎么算了，半夜来问我这个题。

题面：

[https://codeforces.com/contest/1452/problem/D](https://codeforces.com/contest/1452/problem/D)

显然总方案数是 $2 ^ n$

问题是求出建造合法的方案数。

不难看出，每座塔能覆盖的区间总长度一定是一个奇数，

要求所有塔的覆盖范围不重叠，

问题就化为了求正整数 $n$ 能拆分成若干个允许相同的奇数的和的方案个数。

因此考虑 dp .

对于任意的正整数 $n$ ，

我们可以枚举所有不大于 $n$ 的奇数 $i$ ，将其作为拆分序列的首个奇数，

这样，除去 $i$ 后，我们只需要求解剩余部分（即 $n - i$ ）的拆分方案数即可。

上述过程的状态转移方程为

奇数：

$$dp[n] = dp[n - 1] + dp[n - 3] + ... + dp[0]$$

偶数：

$$dp[n] = dp[n - 1] + dp[n - 3] + ... + dp[1]$$

考虑到 $dp[1] = dp[0] = 1$

可以得到

$$dp[2n] = dp[1] + dp[3] + dp[5] + ... + dp[2n - 1]$$

$$dp[2n - 1] = 1 + dp[2] + dp[4] + ... + dp[2n - 2]$$

正是斐波那契数列。

代码：

```cpp
#include <cstdlib>
#include <cstdio>
#define MOD 998244353ll
using namespace std;
long long fastPow(long long a,int b,long long m)
{
	long long ans = 1;
	while (b)
	{
		if (b & 1)
		{
			b--;
			ans *= a;
			ans %= m;
		}
		b >>= 1;
		a *= a;
		a %= m;
	}
	return ans;
}
long long inv(long long x)
{
	return fastPow(x, MOD - 2, MOD);
}
int n;
int now = 1, pre = 1, temp;
int main()
{
	scanf("%d", &n);
	for (int i = 3; i <= n; i++)
	{
		temp = (now + pre) % MOD;
		pre = now % MOD;
		now = temp % MOD;
	}
	printf("%lld",now * inv(fastPow(2, n, MOD)) % MOD);
	return 0;
}
```