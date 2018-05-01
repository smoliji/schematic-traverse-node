export const EMPTY = Symbol('empty');
export const PRIMITIVE = Symbol('primitive');
export const OBJECT = Symbol('object');
export const ARRAY = Symbol('array');

const schema = (type = PRIMITIVE, data = EMPTY) => {
    return {
        type,
        data,
    };
};

export default schema;
