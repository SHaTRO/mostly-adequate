import memoize from 'fast-memoize';

import { power100 } from './purity';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
BigInt.prototype.toJSON = function() {
  return this.toString();
};

describe('purity - power5', () => {
  const inputs: bigint[] = [ 0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n ];
  const outputs: bigint[] = [ 0n, 1n, 2n ** 100n, 3n ** 100n, 4n ** 100n, 5n ** 100n, 6n ** 100n, 7n ** 100n, 8n ** 100n, 9n ** 100n, 10n ** 100n ];
  const serializer = (n: bigint): string => n.toString();
  const verify = (f: (n: bigint) => bigint) => {
    const results: bigint[] = inputs.map(f);
    expect(results.map(serializer)).toEqual(outputs.map(serializer));
  };
  const testLoop = (f: (n: bigint) => bigint, count: number) => {
    const start = Date.now(); 
    for (let i=0; i<count; i++) {
      verify(f);
    }
    const end = Date.now();
    console.log(`duration: ${end - start}`);
  };

  it('greedy power of 100, 1000x', () => {
    testLoop(power100, 1000);
  });

  it('greedy power of 100, memoized 1000x', () => {
    const power100memoized = memoize(power100);
    testLoop(power100memoized, 1000);
  });

});
