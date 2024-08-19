# valiseri

一个简单且轻量级的库，用于使用ES类和装饰器（Stage 3）进行数据序列化和反序列化。

[English Version](./README.md)

## 什么是valiseri？

valiseri是一个TypeScript库，它提供了一种方便的方式来使用ES类和装饰器进行数据序列化和反序列化。它允许您轻松地将复杂的对象结构转换为可以存储或传输的格式，然后将其恢复到其原始形式。

## 用法

要使用valiseri，请按照以下步骤进行操作：

1. 在您的项目中将valiseri安装为依赖项：

```bash
npm install valiseri valibot
```

2. 从valiseri中导入必要的函数和装饰器，并可选择从valibot中导入验证器：

```typescript
import { serializable, load, dump } from 'valiseri';
import * as v from 'valibot';
```

3. 使用`@serializable`装饰器定义可序列化的数据类：

```typescript
@serializable
class Address {
  @serializable.field(v.string())
  accessor street: string;

  @serializable.field(v.string())
  accessor city: string;

  @serializable.field(v.string())
  accessor zipCode: string;
}

@serializable
class Person {
  @serializable.field(v.string())
  accessor name: string;

  @serializable.field(v.number())
  accessor age: number;

  // 嵌套的可序列化对象也受支持，它将被递归地序列化和反序列化。
  @serializable.field(Address)
  accessor address: Address;
}
```

4. 创建数据类的实例并设置其属性：

```typescript
const person = new Person();
person.name = "John Doe";
person.age = 30;
person.address = new Address();
person.address.street = "123 Main St";
person.address.city = "Anytown";
person.address.zipCode = "12345";
```

5. 使用`dump`函数将实例序列化：

```typescript
const data = dump(person);
```

6. 使用`load`函数反序列化数据：

```typescript
const loadedPerson = load(Person, data);
```

7. 根据需要使用反序列化的对象：

```typescript
console.log(loadedPerson.name); // 输出: "John Doe"
console.log(loadedPerson.age); // 输出: 30
console.log(loadedPerson.address.street); // 输出: "123 Main St"
console.log(loadedPerson.address instanceof Address); // 输出: true
```

就是这样！您已成功使用valiseri进行数据序列化和反序列化。

有关更高级的用法和选项，请参阅[文档](https://github.com/JuerGenie/valiseri)和[valibot](https://valibot.dev/)。