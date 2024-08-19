import { serializable, load, dump } from "../src/index";
import { describe, it, expect } from "vitest";
import * as v from "valibot";

describe("Serialization Tests", () => {
  it("should serialize and deserialize a class instance", () => {
    @serializable
    class Person {
      @serializable.field(v.string())
      accessor name: string;

      @serializable.field(v.number())
      accessor age: number;
    }

    const person = new Person();
    person.name = "John Doe";
    person.age = 30;

    const data = dump(person);
    const loadedPerson = load(Person, data);

    expect(loadedPerson).toEqual(person);
  });

  it("should handle optional properties during serialization", () => {
    @serializable
    class Person {
      @serializable.field(v.string())
      accessor name: string;

      @serializable.field(v.optional(v.number()))
      accessor age: number = 0;
    }

    const person = new Person();
    person.name = "John Doe";

    const data = dump(person);
    const loadedPerson = load(Person, data);

    expect(loadedPerson).toEqual(person);
    expect(loadedPerson.age).toBe(0);
  });

  it("should handle nested classes during serialization", () => {
    @serializable
    class Address {
      @serializable.field(v.string())
      accessor street: string;

      @serializable.field(v.string())
      accessor city: string;
    }

    @serializable
    class Person {
      @serializable.field(v.string())
      accessor name: string;

      @serializable.field(v.number())
      accessor age: number;

      @serializable.field(Address)
      accessor address: Address;

      get bio() {
        return `${this.name} is ${this.age} years old, and lives at ${this.address.street}, ${this.address.city}`;
      }
    }

    const person = new Person();
    person.name = "John Doe";
    person.age = 30;
    person.address = new Address();
    person.address.street = "123 Fake St";
    person.address.city = "Springfield";

    const data = dump(person);
    const loadedPerson = load(Person, data);

    expect(loadedPerson).toEqual(person);
    expect(loadedPerson.address).instanceOf(Address);
    expect(loadedPerson.bio).toEqual(person.bio);
  });
});
