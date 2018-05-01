import * as identity from 'lodash.identity';
import * as mapValues from 'lodash.mapvalues';
import whenDone from './whenDone';
import schema, {
    OBJECT,
    ARRAY,
    PRIMITIVE
} from './schema';

const traversePrimitive = (schema, iteratee = identity) =>
    (subject) => whenDone(iteratee, subject);

const traverseObject = (schema, iteratee = identity) =>
    (subject = {}) =>
        whenDone(
            iteratee,
            mapValues(schema.data, (childTraverse, key) => childTraverse(subject[key]))
        );

const traverseArray = (schema, iteratee = identity) =>
    (subject = []) => whenDone(
        iteratee,
        subject.map(item => schema.data(item))
    );

const traverse = (schema, iteratee) => {
    switch (schema.type) {
        case OBJECT:
            return traverseObject(schema, iteratee);
        case ARRAY:
            return traverseArray(schema, iteratee);
        case PRIMITIVE:
        default:
            return traversePrimitive(schema, iteratee);
    }
};

export const shape = (structure, iteratee) =>
    traverse(
        schema(OBJECT, structure),
        iteratee
    );

export const array = (structure, iteratee) =>
    traverse(
        schema(ARRAY, itemStructure),
        iteratee
    )

export default traverse;
