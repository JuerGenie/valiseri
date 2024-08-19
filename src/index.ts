import * as v from "valibot";

type AnySchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

const key = Symbol("schemas");
const addSchemaToMetadata = (ctx: DecoratorContext, schema: AnySchema) => {
  (ctx.metadata[key] ??= {})[ctx.name] = schema;
};
const getSchemasFromMetadata = (ctx: DecoratorContext) => {
  return (ctx.metadata[key] ?? {}) as v.ObjectEntries;
};

const cache = new WeakMap<
  new (...args: any) => any,
  { schema: AnySchema; transform: v.SchemaWithPipe<[any, any]> }
>();

/**
 * Registers a class as serializable.
 *
 * ```
 * ⁣@serializable
 * class Person {
 *   ⁣@serializable.field(v.string())
 *   accessor name: string;
 *
 *   ⁣@serializable.field(v.number())
 *   accessor age: number;
 * }
 *
 * const person = new Person();
 * person.name = "John Doe";
 * person.age = 30;
 *
 * const data = dump(person); // { name: "John Doe", age: 30 }
 * const loadedPerson = load(Person, data); // Person { name: "John Doe", age: 30 }
 * ```
 */
export const serializable = (
  target: new (...args: any) => any,
  ctx: ClassDecoratorContext
) => {
  const schema = v.object(getSchemasFromMetadata(ctx));
  cache.set(target, {
    schema,
    transform: v.pipe(
      schema,
      v.transform((value: any) => {
        const instance = new target();
        Object.assign(instance, value);
        return instance;
      })
    ),
  });
};
/**
 * Creates a new accessor decorator that marks an accessor as serializable with the schema provided.
 *
 * @see serializable
 */
serializable.field = (
  schema: AnySchema | (new (...args: any) => any)
): (<This, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
) => void) => {
  const target =
    typeof schema === "function" && cache.has(schema)
      ? cache.get(schema)?.transform
      : schema;

  return (_, ctx) => {
    if (ctx.static) {
      throw new Error("Static accessors are not supported");
    }
    addSchemaToMetadata(ctx, target as AnySchema);
  };
};

/**
 * Loads an instance of a class from a serialized object.
 *
 * @see serializable
 */
export const load = <Cls extends new (...args: any) => any>(
  cls: Cls,
  data: object
) => {
  const { transform } = cache.get(cls);
  if (!transform) {
    throw new Error("Class is not serializable");
  }
  return v.parse(transform as any, data) as InstanceType<Cls>;
};
/**
 * Dumps an instance of a class to a serialized object.
 *
 * @see serializable
 */
export const dump = <Cls extends new (...args: any) => any>(
  instance: InstanceType<Cls>
) => {
  const { schema } = cache.get(instance.constructor as Cls);
  if (!schema) {
    throw new Error("Class is not serializable");
  }
  return v.parse(schema, instance) as object;
};

export const resolve = (cls: new (...args: any) => any) => {
  return cache.get(cls)?.schema;
};
