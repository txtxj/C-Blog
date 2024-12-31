---
title: "二叉树打印"
date: 2022-05-14T16:07:55+08:00
math: mathjax
tags: ["笔记"]
cover: https://s2.loli.net/2022/05/14/inBpH1FlPMfgOxd.jpg
grow: mid
---

之前调红黑树的时候写的一个二叉树打印方法。

可以以如下图形式在控制台输出树的结构。

![20220514_1.png](https://s2.loli.net/2022/05/14/UxpEL73QnSKr8Vs.png)

代码如下：

```cpp
#ifdef DEBUG
static void DebugPrintMessage(Node* p)
{
	// This is an example print function
	// Here puts the info you want to print
	std::cout << "val: " << p -> val << " siz: " << p -> siz << " color: " << (p -> color ? "R" : "B") << std::endl;
}
void DebugPrintNode(Node* p, int step, int valid, bool right)
{
	if (p == nil) return;
	for (int i = 0; i < step; i++)
	{
		std::cout << ((valid & (1 << (i - 1))) == 0 ? "   ": "│  ");
	}
	std::cout << (right ? "└ " : "├ ");
	DebugPrintMessage(p);
	DebugPrintNode(p -> left, step + 1, valid | (1 << step), p -> right == nil);
	DebugPrintNode(p -> right, step + 1, valid & ~(1 << step), true);
}
#endif
void DebugPrintTree()
{
	#ifdef DEBUG
	std::cout << "/******************/" << std::endl << "TREE" << std::endl;
	DebugPrintNode(root, 0, 0, true);
	std::cout << "/******************/" << std::endl;
	#endif
}
```

上述代码要求树使用二叉链表的形式存储，每个结点的两个儿子分别使用 `left` 和 `right` 指针。

要求将 `root` 作为一个全局变量，作为函数 `void DebugPrintNode()` 的入口结点。

使用时需要将 `DebugPrintMessage(Node*)` 函数内输出内容修改为自己代码中树结点的信息，然后在需要输出树的位置插入代码 `DebugPrintTree();` 即可。

可以参考笔者红黑树类的定义：

```cpp
class BlackRedTree
{
private:
	enum Color {black, red};
	struct Node
	{
		int val;
		int siz;
		Node* left;
		Node* right;
		Node* parent;
		Color color;
	};
	Node* nil;
	Node* root;
private:
	#ifdef DEBUG
	static void DebugPrintMessage(Node* p);
	void DebugPrintNode(Node* p, int step, int valid, bool right);
	#endif
	void DebugPrintTree();
}
```

[一个实例](https://github.com/txtxj/USTC-Algorithm/blob/master/lab2/BRT/brt.cpp)