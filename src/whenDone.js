import * as fromPairs from 'lodash.frompairs';
import * as toPairs from 'lodash.topairs';
import * as isPlainObject from 'lodash.isplainobject';
import * as identity from 'lodash.identity';
import * as values from 'lodash.values';


const isPromise = x => (x && (typeof x.then === 'function'));

const whenDone = (iteratee = identity, value) => {
    if (Array.isArray(value)) {
        if (value.some(isPromise)) {
            return Promise.all(value)
                .then(valueResult => iteratee(valueResult));
        }
        return iteratee(value);
    }
    if (isPlainObject(value)) {
        if (!values(value).some(isPromise)) {
            return iteratee(value);
        }
        return whenDone(
            iteratee,
            whenDone(
                pairs => whenDone(
                    x => fromPairs(x),
                    pairs.map(([key, keyValue]) =>
                        whenDone(
                            valueResult => [key, valueResult],
                            keyValue
                        )
                    )
                ),
                toPairs(value)
            )
        );
    }
    if (isPromise(value)) {
        return value.then(iteratee);
    }
    return iteratee(value);
};

export default whenDone;
