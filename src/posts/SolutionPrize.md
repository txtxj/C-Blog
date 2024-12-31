---
title: "【题解】 领奖台数"
date: 2022-05-13T17:59:19+08:00
math: mathjax
tags: ["题解"]
cover: https://s2.loli.net/2022/05/13/IcUxLfh3j2RZ79p.jpg
grow: mid
---

这是陈雪老师《算法基础》课程中的一道作业题，似乎是老师原创的（在网上找题解没找到）。

题面如下

> 给定任意一个序列 $a_1, \dots, a_n$，其中没有重复元素。
>
> 如果 $i < j < k$ 且 $a_j > a_i > a_k$，三个数字的大小关系就像运动会颁奖时的领奖台。
>
> 于是我们称序列中满足该条件的 三元组 $(i, j, k)$ 的个数为序列的领奖台数。
>
> 设计一个算法来计算序列的领奖台数。
>
> 为了简化题目，规定 $a$ 中没有相同元素。

即在一个数组里找具有如下图形式的三元组。

![20220513_1.jpg](https://s2.loli.net/2022/05/13/rQpHSqWkls4yGCO.jpg)

想到另一道经典的归并排序题目：求 $i < j < k$ 且 $a_j > a_i$ 且 $a_j > a_k$ ，可以求每个位置的顺序对和逆序对个数，最后相乘得到结果。

这道题是上面题目的加强版，也可以从每个位置顺序对、逆序对的个数入手计算。

因此考虑分治。

对于任意的 $i < j < k$ ，在一次合并中，如果 $i, j, k$ 位于同一待合并区间，则其对本次合并无贡献，不考虑。

需要考虑的情况只有两种：

- $i < j \le mid < k$ 
- $i \le mid < j < k$

其中 $mid$ 为分割锚点。

考虑到归并排序过程中，每次合并的元素均处于所在的待合并区间的首位，故上述两种情况分别对应了待合并元素为 $a_i$ 和待合并元素为 $a_j$ 的情况。

- 对于第一种情况 $i < j \le mid < k$ ，

  ![20220513_2.jpg](https://s2.loli.net/2022/05/13/zqyNQXf5Z2FvwEV.jpg)

  考虑对于任意的 $i$ ，

  首先，要求 $i < j \le mid$ 且 $a_i < a_j$ ，实际上满足条件的 $a_j$ 的数量即为前半区间中以 $a_i$ 为首的顺序对的个数。

  其次，要求 $i < mid < k$ 且 $a_k < a_i$ ，此时满足条件的 $a_k$ 的数量即为右侧比 $a_i$ 小的数的个数。在两个半区间均有序的情况下，这个值等于 $t - mid - 1$ ，其中 $t$ 为右侧第一个比 $a_i$ 大的数的下标。

  综上，对于数组中任意一个数，如果它在左半区间，则可以将其视为 $a_i$ ，其对答案产生的贡献为 
  $$
  \\#(\text{以} a_i \text{为头的顺序对数量}) \times \\#(\text{右侧比} a_i \text{小的数的数量})
  $$

- 对于第二种情况 $i \le mid < j < k$ ，

  考虑对于任意的 $j$ ，由于我们只能记录对于 $a_j$ 而言，满足条件的 $a_k$ 的数量（即，右区间中以 $a_j$ 为头的逆序对数量），此时对于 $a_i$ 和 $a_k$ 的比较信息丢失，如果仍按照第一种情况分析，则最终结果无法保证 $a_i > a_k$ 。

  即满足 $i \le mid < j < k$ 且 $a_j > a_i$ 且 $a_j > a_k$ 的数量为 
  $$
  \\#(\text{以} a_j \text{为头的逆序对数量}) \times \\#(\text{左侧比} a_j \text{小的数的数量})
  $$
  发现此时实际上比要求的答案多计算了一种情况 $i \le mid < j < k$ 且 $a_j > a_k > a_i$ ，而这种情况与第一种情况刚好是对称的，

  ![20220513_3.jpg](https://s2.loli.net/2022/05/13/sQ1Wk46IfLSZGJr.jpg)

  可以使用同样的方法计算出来，多计算的数量为
  $$
  \\#(\text{以} a_k \text{为尾的逆序对数量}) \times \\#(\text{左侧比} a_k \text{小的数的数量})
  $$
  由于 $j, k$ 两者没有相关性，上述两式可合并为
  $$
  (\\#(\text{以} a_j \text{为头的逆序对数量}) - \\#(\text{以} a_j \text{为尾的逆序对数量})) \times \\#(\text{左侧比} a_j \text{小的数的数量})
  $$
  即为该种情况下所求的结果

核心代码如下

```cpp
/*
orderHead[i] 表示以 a[i] 为头的顺序对数量
reverseDf[j] 表示以 a[j] 为头的逆序对数量 - 以 a[j] 为尾的逆序对数量
两 temp 数组用于搬运数据时作为上述两数组的临时存储空间
sum 为之前所有子问题的贡献
cnt 为当此合并的贡献
*/
long long MergeSort(int l, int r)
{
	if (l == r) return 0;
	int mid = (l + r) >> 1;
	long long sum = MergeSort(l, mid) + MergeSort(mid + 1, r);
	long long cnt = 0;
	int i, j, p;
	for (p = l, i = l, j = mid + 1; i <= mid && j <= r; p += 1)
	{
		if (a[i] <= a[j])
		{
			temp[p] = a[i];
			tempOrder[p] = orderHead[i] + r - j + 1;
			tempReverse[p] = reverseDf[i] + j - 1 - mid;
			cnt += orderHead[i] * (j - mid - 1);
			i += 1;
		}
		else
		{
			temp[p] = a[j];
			tempOrder[p] = orderHead[j];
			tempReverse[p] = reverseDf[j] + i - 1 - mid;
			cnt += reverseDf[j] * (i - l);
			j += 1;
		}
	}
	while (i <= mid)
	{
		temp[p] = a[i];
		tempOrder[p] = orderHead[i];
		tempReverse[p] = reverseDf[i] + r - mid;
		cnt += orderHead[i] * (r - mid);
		i += 1;
		p += 1;
	}
	while (j <= r)
	{
		temp[p] = a[j];
		tempOrder[p] = orderHead[j];
		tempReverse[p] = reverseDf[j];
		cnt += reverseDf[j] * (mid + 1 - l);
		j += 1;
		p += 1;
	}
	while (l <= r)
	{
		a[l] = temp[l];
		orderHead[l] = tempOrder[l];
		reverseDf[l] = tempReverse[l];
		l += 1;
	}
	return sum + cnt;
}
```

[完整代码](https://github.com/txtxj/USTC-Algorithm/blob/master/lab3/PrizeNumber/prize.cpp)

