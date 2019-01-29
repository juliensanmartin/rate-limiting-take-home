import lolex from 'lolex';

import multiRateLimit from './multiRateLimitWithPromises';

function expectPromise(obj){
    expect(obj instanceof Promise).toBeTruthy();
}

describe('rateLimit works as intended', () => {

    const clock = lolex.install();

    it('returns a function', () => {
        const testFn = jest.fn();
        const wrapped = multiRateLimit(testFn, 100, 2);
        expect(typeof wrapped).toBe("function");
    });

    it('wrapped returns a promise', () => {
        const testFn = jest.fn();
        const wrapped = multiRateLimit(testFn, 100, 2);
        const returnValue = wrapped();

        expectPromise(returnValue);
    });

    fit('rate limits and preserves values', async (done) => {

        const testFn = jest.fn((resolveTo, timeToWait) => {
            return new Promise(resolve => {
                console.log('waiting', timeToWait);
                setTimeout(() => {
                    resolve(resolveTo);
                    console.log('timeout at', Date.now());
                }, timeToWait);
            });
        });

        const wrapped = multiRateLimit(testFn, 100, 2);

        wrapped('a', 50);
        wrapped('b', 55);
        wrapped('c', 125);
        wrapped('d', 5);
        wrapped('e', 7);
        wrapped('f', 165);

        expect(testFn).toHaveBeenCalledTimes(2);
        expectPromise(testFn.mock.results[0].value);
        expectPromise(testFn.mock.results[1].value);

        clock.tick(51); //time is at 51
        expect(await testFn.mock.results[0].value).toBe('a');
        clock.tick(10); //time is at 61
        expect(await testFn.mock.results[1].value).toBe('b');
        expect(testFn).toHaveBeenCalledTimes(2);

        clock.tick(40); //time is at 101
        expect(testFn).toHaveBeenCalledTimes(2);

        clock.tick(50); //time is at 151
        console.log('clock at: ', Date.now())
        expect(testFn).toHaveBeenCalledTimes(3); //result of 3rd call ('c') should be available at time 275

        clock.tick(5); //time is at 156
        expect(testFn).toHaveBeenCalledTimes(4); //result of 4th call ('d') should be available at 200
        
        clock.tick(6); //time is 162
        expect(await testFn.mock.results[3].value).toBe('d');

        clock.tick(101); //time is 263
        expect(testFn).toHaveBeenCalledTimes(5); //result of 5th call ('e') should be available at 270

        clock.tick(8); //time is 271
        expect(await testFn.mock.results[4].value).toBe('e');

        clock.tick(10); //time is 281
        expect(await testFn.mock.results[2].value).toBe('c');

        clock.tick(100); //time is 381
        expect(testFn).toHaveBeenCalledTimes(6); //result of 6th call ('f') should be available at 270+100+165 = 535

        clock.tick(160); //time is 541
        expect(await testFn.mock.results[5].value).toBe('f');

        done();
    });

});
