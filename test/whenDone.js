const mocha = require('mocha');
const expect = require('chai').expect;
const sinon = require('sinon');

const whenDone = require('../dist/whenDone').default;

const identity = require('lodash.identity');

describe('whenDone', () => {
    describe('Edge cases', () => {
        it('empty', () => {
            expect(whenDone()).to.equal(undefined);
        });
    })
    describe('Direct value', () => {
        it('Sync', () => {
            const fn = sinon.spy(identity);
            const subject = 1;
            const result = whenDone(fn, subject);
            expect(result).to.equal(subject);
            expect(fn.called).to.equal(true);
            expect(fn.calledWith(subject)).to.equal(true);
        });
        it('Async', () => {
            const fn = sinon.spy(identity);
            const subject = 1;
            const subjectAsync = Promise.resolve(subject);
            const result = whenDone(fn, subjectAsync);
            return result
                .then(result => {
                    expect(result).to.equal(subject);
                    expect(fn.called).to.equal(true);
                    expect(fn.calledWith(subject)).to.equal(true);
                });
        });
    });
    describe('Arrays', () => {
        it('Sync', () => {
            const fn = sinon.spy(identity);
            const subject = [1, 2];
            const result = whenDone(fn, subject);
            expect(result).to.equal(subject);
            expect(fn.called).to.equal(true);
            expect(fn.calledWith(subject)).to.equal(true);
        });
        it('Async', () => {
            const fn = sinon.spy(identity);
            const subject = [1, 2];
            const subjectAsync = subject.map(x => Promise.resolve(x));
            const result = whenDone(fn, subjectAsync);
            return result
                .then(result => {
                    expect(result).to.eql(subject);
                    expect(fn.called).to.equal(true);
                    expect(fn.calledWith(subject)).to.equal(true);
                });
        });
    });
    describe('Objects', () => {
        it('Sync', () => {
            const fn = sinon.spy(identity);
            const subject = { foo: 'foo', bar: 'bar' };
            const result = whenDone(fn, subject);
            expect(result).to.eql(subject);
            expect(fn.called).to.equal(true);
            expect(fn.calledWith(subject)).to.equal(true);
        });
        it('Async', () => {
            const fn = sinon.spy(identity);
            const subject = { foo: 'foo', bar: 'bar' };
            const subjectAsync = Object.assign({}, subject, { foo: Promise.resolve(subject.foo) });
            const result = whenDone(fn, subjectAsync);
            return result
                .then(result => {
                    expect(result).to.eql(subject);
                    expect(fn.called).to.equal(true);
                    expect(fn.calledWith(subject)).to.equal(true);
                });
        });
    });
});
