---
title: "C# 类的多态"
date: 2022-09-10T16:16:23+08:00
toc: true
math: md
tags: ["C#", "笔记"]
cover: https://s2.loli.net/2022/09/10/nueZiWDaydjLhrS.jpg
grow: 
---

面试被问到如何理解类的多态性了，没答出来呜呜呜。

> 同一操作作用于不同的对象，可以有不同的解释，产生不同的执行结果，这就是多态性。

---

C# 类的多态性允许把不同的派生类用一个统一的基类接口来处理。

即一段代码可以同样地工作在所有这些具有同一个基类的不同派生类上。

并且不同的派生类可以使用同一个接口实现不同的操作。

在 C# 中提供了三种方法来实现类的多态：

 - 虚方法
 - 抽象类与抽象方法
 - 接口

如果需要使用基类实例化对象，则使用虚方法；

如果不需要使用基类实例化对象，则使用抽象类与抽象方法。

## 虚方法

在基类中将一个方法声明为 `virtual` ，就可以在其派生类中使用 `override` 重写该方法（也可以使用 `new` 隐藏基类中的方法，两者有所区别）。

例如，我们需要编写一个 `Character` 基类，用于表示各种角色；此外，在 `Character` 基类上派生出 `Player` 类表示玩家。

基类：

```csharp
public class Character
{
    public virtual void Die()
    {
        Console.WriteLine("A Character Died.");
    } 
}
```

派生类：

```csharp
class Player : Character
{
    public override void Die()
    {
        Console.WriteLine("A Player Died.");
    }
}
```

如果想要玩家死亡之后还会触发游戏结束，那么可以直接在 `Player` 派生类中添加方法

```csharp
class Player : Character
{
    public void GameOver()
    {
        Console.WriteLine("Game Over!");
    }

    public override void Die()
    {
        Console.WriteLine("A Player Died.");
        GameOver();
    }
}
```

测试一下：

```csharp
static void Main(string[] args)
{
    Character character = new Character();
    Player player = new Player();
    character.Die();
    player.Die();
}
```

运行结果

```
A Character Died.
A Player Died.
Game Over!
```

## 抽象类与抽象方法

例如，我们需要用类表示猫、鸽子、鱼等各种动物，那么可以从中抽象出动物这个概念作为基类。

我们可以实例化一只猫、一只鸽子、一条鱼，但不能实例化一个作为基类的动物。

基类：

```csharp
abstract class Animal
{
    public abstract void Eat();
}
```

需要注意的是，与虚方法不同，此处使用抽象方法，不能有方法体。

派生类仍使用 `override` 重写方法

派生类：

```csharp
class Cat : Animal
{
    public override void Eat()
    {
        Console.WriteLine("Cat eats");
    }
}

class Dove : Animal
{
    public override void Eat()
    {
        Console.WriteLine("Dove eats");
    }
}

class Fish : Animal
{
    public override void Eat()
    {
        Console.WriteLine("Fish eats");
    }
}
```

在定义派生类时，必须给出抽象方法的方法体，否则会报错 `Abstract inherited member is not implemented`

鸽子会飞，鱼会游泳，那么就可以单独为这两种派生类定义飞和游泳方法：

```csharp
class Dove : Animal
{
    public override void Eat()
    {
        Console.WriteLine("Dove eats");
    }

    public void Fly()
    {
        Console.WriteLine("Dove can fly");
    }
}

class Fish : Animal
{
    public override void Eat()
    {
        Console.WriteLine("Fish eats");
    }
    
    public void Swim()
    {
        Console.WriteLine("Fish can swim");
    }
}
```

测试一下

```csharp
static void Main(string[] args)
{
    Animal animal = new Animal();
}
```

报错：不能实例化一个抽象类。

```
Cannot create an instance of the abstract class
```

再次测试：

```csharp
static void Main(string[] args)
{
    Cat cat = new Cat();
    Dove dove = new Dove();
    Fish fish = new Fish();
    foreach (Animal animal in new Animal[]{cat, dove, fish})
    {
        animal.Eat();
    }
    dove.Fly();
    fish.Swim();
}
```

输出结果：

```
Cat eats
Dove eats
Fish eats
Dove can fly
Fish can swim
```

## 接口

一个派生类只能继承自一个基类，如果想要实现类似一个派生类继承自多个基类的效果，就需要使用接口。

接口成员不能使用 `private` `public` `protected` `internal` `static` `virtual` `abstract` `sealed` 修饰符，

接口中声明的方法默认是 `public` 的。

接口中不能定义字段，不能含有方法体，可以定义属性。

接口使用 `interface` 定义，通常使用大写字母 `I` 开头命名：

```csharp
interface IBark
{
    // float Volume { get; set; } // This is ok
    void Bark();
}
```

猫和鸽子都会叫，因此可以如下定义猫和鸽子：

```csharp
class Cat : Animal, IBark
{
    public override void Eat()
    {
        Console.WriteLine("Cat eats");
    }

    public void Bark()
    {
        Console.WriteLine("Meo");
    }
}

class Dove : Animal, IBark
{
    public override void Eat()
    {
        Console.WriteLine("Dove eats");
    }
    
    public void Bark()
    {
        Console.WriteLine("Gu");
    }
}
```

测试一下：

```csharp
static void Main(string[] args)
{
    Cat cat = new Cat();
    Dove dove = new Dove();
    foreach (IBark animal in new IBark[]{cat, dove})
    {
        animal.Bark();
    }
}
```

输出：

```
Meo
Gu
```

## 里氏转换原则

在上文抽象类与抽象方法的例子中，可以看到这样的写法

```csharp
foreach (Animal animal in new Animal[]{cat, dove, fish})
{
    animal.Eat();
}
```

这样的写法将三个子类对象装入了一个基类的数组中，并在后续执行了基类对象的方法。

这样的写法涉及到了里氏转换原则：

如果 `S` 是 `T` 的子类型，对于 `S` 类型的任意对象，如果将他们看作是 `T` 类型的对象，则对象的行为也理应与期望的行为一致。

在 C# 中其表现为

 - 可以将一个子类对象赋值给其父类对象，但不能将一个父类对象赋值给子类对象。
 - 子类对象可以调用父类中的成员，但父类对象不能调用子类中的成员。
 - 如果父类装的是子类对象，可以将这个对象强转化为子类的对象（使用 `as` 或 `is`）。

虚方法测试：

```csharp
static void Main(string[] args)
{
    Player player = new Character() as Player;
    player.Die(); // Warning: Possible 'System.NullReferenceException'
}
```

抽象类与抽象方法测试：

```csharp
static void Main(string[] args)
{
    Cat cat = new Cat();
    Animal animal = cat;
    Cat cat2 = animal; // Error: Cannot convert source type 'Animal' to target type 'Cat'
    Cat cat3 = (Cat)animal; // Safe cast
    Cat cat4 = animal as Cat; // Safe cast
    Dove dove1 = (Dove)animal; // Warning: Possible 'System.InvalidCastException'
    Dove dove2 = animal as Dove; // Warning: Expression is always null
}
```

## 重写与隐藏

在虚方法一节中，提到可以使用 `override` 重写和 `new` 隐藏基类中的虚方法。

两者区别在于，如果使用 `override` 重写，那么该对象所继承自的基类中的该方法被修改（其他实例不受影响），

后续即使将该对象赋值给一个基类对象，该基类对象调用被重写的方法时仍然会执行重写后的方法。

例如：

```csharp
class Character
{
    public virtual void Die()
    {
        Console.WriteLine("A Character Died.");
    } 
}

class Player : Character
{
    public void GameOver()
    {
        Console.WriteLine("Game Over!");
    }

    public override void Die()
    {
        Console.WriteLine("A Player Died.");
        GameOver();
    }
}

static void Main(string[] args)
{
    Character player = new Player();
    player.Die();
}
```

输出：

```
A Player Died.
Game Over!
```

而 `new` 隐藏则是在派生类中重新声明了一个同名方法，并将基类的方法隐藏起来，并没有覆盖。

将上述代码中的 `override` 替换为 `new` 之后：

```csharp
class Character
{
    public virtual void Die()
    {
        Console.WriteLine("A Character Died.");
    } 
}

class Player : Character
{
    public void GameOver()
    {
        Console.WriteLine("Game Over!");
    }

    public new void Die()
    {
        Console.WriteLine("A Player Died.");
        GameOver();
    }
}

static void Main(string[] args)
{
    Character player = new Player();
    player.Die();
}
```

输出结果：

```
A Character Died.
```

可以看到将 `Player` 的一个实例赋值给 `Character` 实例后，调用 `Die` 方法，实际执行的是 `Character` 类的方法。

## 实际用途

[统一参数接口](https://huotuyouxi.com/2021/11/06/c-sharp-002/#%E7%BB%9F%E4%B8%80%E5%8F%82%E6%95%B0%E6%8E%A5%E5%8F%A3)