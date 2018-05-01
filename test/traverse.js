const mocha = require('mocha');
const expect = require('chai').expect;

const identity = require('lodash.identity');
const mapKeys = require('lodash.mapkeys');

const traverse = require('../dist/traverse').default;
const { shape, array } = require('../dist/traverse');
const schema = require('../dist/schema').default;
const { PRIMITIVE, OBJECT, ARRAY } = require('../dist/schema');

const wrapper = (wrapTag) => (x) => `${wrapTag}(${x})`;
const wrapperObjectKeys = (wrapTag) => (o) => mapKeys(o, (value, key) => wrapper(wrapTag)(key));
const wraperArrayItems = (wrapTag) => (a) => a.map(wrapper(wrapTag));

const primitive = traverse(schema(PRIMITIVE), identity);
const promised = fn => x => Promise.resolve(fn(x));

describe('traverse', () => {
    describe('Primitive schema', () => {
        const wrap = wrapper('X');
        it('Simple schema', () => {
            const result = traverse(
                schema(PRIMITIVE),
                wrap
            )(1);
            expect(result).to.equal(wrap(1))
        });
        it('Simple schema (async)', () => {
            const result = traverse(
                schema(PRIMITIVE),
                promised(wrap)
            )(1);
            return  result.then(result => {
                expect(result).to.equal(wrap(1))
            });
        });
    })
    describe('Object schema', () => {
        const wrap = wrapper('X');
        const wrapKeys = wrapperObjectKeys('K');
        const wrapEach = wraperArrayItems('A');
        it('Empty schema', () => {
            const result = traverse(
                schema(
                    OBJECT,
                    {}
                ),
                wrapKeys
            )(
                { foo: 'bar' }
            );
            expect(result).to.eql(wrapKeys({}));
        });
        it('Flat schema', () => {
            const result = traverse(
                schema(
                    OBJECT,
                    {
                        foo: primitive
                    }
                ),
                wrapKeys
            )(
                { foo: 'bar' }
            );
            expect(result).to.eql(wrapKeys({ foo: 'bar' }));
        });
        it('Flat schema (async)', () => {
            const result = traverse(
                schema(
                    OBJECT,
                    {
                        foo: primitive
                    }
                ),
                promised(wrapKeys)
            )(
                { foo: 'bar' }
            );
            return result.then(result => {
                expect(result).to.eql(wrapKeys({ foo: 'bar' }));
            });
        });
        it('Nested mixed schema', () => {
            const result = traverse(
                schema(
                    OBJECT,
                    {
                        foo: primitive,
                        subobject: traverse(
                            schema(
                                OBJECT,
                                {
                                    bar: primitive
                                }
                            ),
                            wrapKeys
                        ),
                        collection: traverse(
                            schema(ARRAY, primitive),
                            wrapEach
                        ),
                        subobjects: traverse(
                            schema(
                                ARRAY,
                                traverse(
                                    schema(
                                        OBJECT,
                                        {
                                            baz: primitive,
                                        }
                                    ),
                                    wrapKeys
                                )
                            ),
                            identity
                        )
                    }
                ),
                wrapKeys
            )(
                {
                    foo: 'foo',
                    nonexisting: 'nonexistint',
                    subobject: {
                        bar: 'bar',
                    },
                    collection: [
                        1
                    ],
                    subobjects: [
                        {
                            baz: 'baz',
                        },
                    ]
                }
            );
            expect(result).to.eql(
                wrapKeys(
                    {
                        foo: 'foo',
                        subobject: wrapKeys(
                            {
                                bar: 'bar',
                            }
                        ),
                        collection: wrapEach(
                            [
                                1
                            ]
                        ),
                        subobjects: [
                            wrapKeys(
                                {
                                    baz: 'baz',
                                }
                            ),
                        ]
                    }
                )
            )
        });
    });
    describe('Array schema', () => {
        const wrap = wrapper('X');
        const wrapKeys = wrapperObjectKeys('K');
        const wrapEach = wraperArrayItems('A');

        it('Simple', () => {
            const result = traverse(
                schema(
                    ARRAY,
                    primitive
                ),
                wrapEach
            )(
                [1, 2]
            );
            expect(result).to.eql(wrapEach([1, 2]));
        });
        it('Simple (async)', () => {
            const result = traverse(
                schema(
                    ARRAY,
                    primitive
                ),
                promised(wrapEach)
            )(
                [1, 2]
            );
            return result.then(result => {
                expect(result).to.eql(wrapEach([1, 2]));
            });
        });
        it('Object items (empty subject)', () => {
            const result = traverse(
                schema(
                    ARRAY,
                    traverse(
                        schema(
                            OBJECT,
                            {
                                foo: primitive
                            }
                        )
                    )
                ),
                wrapEach
            )(
                []
            );
            expect(result).to.eql(wrapEach([]));

        });
        it('Object items (primitive subject)', () => {
            const result = traverse(
                schema(
                    ARRAY,
                    traverse(schema(OBJECT, { foo: primitive }))
                ),
                items => items.map(wrapKeys)
            )(
                [1, 2]
            );
            expect(result).to.eql(
                [
                    wrapKeys(
                        {
                            foo: undefined,
                            }
                        ),
                    wrapKeys(
                        {
                            foo: undefined,
                        }
                    ),
                ]
            )
        });
    });
});
