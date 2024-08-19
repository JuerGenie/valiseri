# valiseri

A simple and lightweight library for serializing and deserializing data with ES classes and decorators (Stage 3).

[中文版本](./README_zh.md)

## What is valiseri?

valiseri is a TypeScript library that provides a convenient way to serialize and deserialize data using ES classes and decorators. It allows you to easily convert complex object structures into a format that can be stored or transmitted, and then restore them back to their original form.

## Usage

To use valiseri, follow these steps:

1. Install valiseri as a dependency in your project:

```bash
npm install valiseri valibot
```

2. Import the necessary functions and decorators from valiseri, and optionally import validators from valibot:

```typescript
import { serializable, load, dump } from 'valiseri';
import * as v from 'valibot';
```

3. Define your serializable data classes using the `@serializable` decorator:

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

  // Nested serializable object is also supported, it will be serialized and deserialized recursively.
  @serializable.field(Address)
  accessor address: Address;
}
```

4. Create an instance of your data class and set its properties:

```typescript
const person = new Person();
person.name = "John Doe";
person.age = 30;
person.address = new Address();
person.address.street = "123 Main St";
person.address.city = "Anytown";
person.address.zipCode = "12345";
```

5. Serialize the instance using the `dump` function:

```typescript
const data = dump(person);
```

6. Deserialize the data using the `load` function:

```typescript
const loadedPerson = load(Person, data);
```

7. Use the deserialized object as needed:

```typescript
console.log(loadedPerson.name); // Output: "John Doe"
console.log(loadedPerson.age); // Output: 30
console.log(loadedPerson.address.street); // Output: "123 Main St"
console.log(loadedPerson.address instanceof Address); // Output: true
```

That's it! You have successfully used valiseri to serialize and deserialize data.

For more advanced usage and options, please refer to the [documentation](https://github.com/JuerGenie/valiseri) and [valibot](https://valibot.dev/).
