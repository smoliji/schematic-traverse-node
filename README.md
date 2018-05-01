# schematic-traverse

Traverse an input against a schema.

```js
const { schema, traverse } = require('schematic-traverse')

const structureFoo = traverse(
    schema(
        OBJECT,
        {
            foo: traverse(schema(PRIMITIVE), String)
        }
    )
)

structureFoo() // { foo: 'undefined' }
structureFoo({ foo: 1 }) // { foo: '1' }
structureFoo({ foo: {} }) // { foo: '[object Object]' }
```

## API

### `schema(type: SchemaType, structure: Object): Schema`

Cretes an schema with the given type and underlying structure. The structure defines how the subject should be traversed.

```js
const { schema } = require('schematic-traverse');

const {
    // A primitive. Value is passed to traverse function as-is.
    PRIMITIVE,
    // Object schema. Structure description below. Each value describes
    // how to traverse the corresponding object key
    OBJECT,
    // Collection schema. Structure is any traversible for each element of the array.
    ARRAY,
} = schema;
```

#### Object structure
```js
{
    [key: String]: Traversible(Schema)
}
// -->
{
    [key: String]: TraversedResult
}
```

#### Array structure
```js
Traversible(Schema)
// -->
[...TraversedResults]
```

### `traverse(schema: Schema, iteratee: Function = identity): Traversible`

Creates a traversible - a function - when called, the traversible input is matched against the underlying schema.

Traversible function _may_ return a Promise when called, if any of the inner traversibles returns a Promise, resolving with the traversed value result. Otherwise result is returned directly.

## Examples

> Ensure the input matches a given structure.

```js
const string = traverse(
    schema(PRIMITIVE),
    x => String(x || '')
)
const number = traverse(
    schema(PRIMITIVE),
    x => Number(x || 0)
)
const anyOf = (choices) =>
    input => choices.filter(
        choice => input.find(x => (x === choice))
    )

const ensure = traverse(
    schema(
        OBJECT,
        {
            username: string,
            roles: traverse(
                schema(ARRAY, string),
                anyOf(['USER', 'ADMIN'])
            ),
            address: traverse(
                schema(
                    OBJECT,
                    {
                        zip: number,
                        city: string,
                    }
                )
            )
        }
    )
)

ensure()
// { username: '', roles: [], address: { zip: 0, city: '' } }

ensure({ username: 123, roles: ['USER', 'X']})
//  { username: '123',
//   roles: [ 'USER' ],
//   address: { zip: 0, city: '' } }
```