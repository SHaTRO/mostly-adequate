import { map } from 'fp-ts';
import { option } from 'io-ts-types';
import { add, multiply } from './mathstuff';

describe('mathstuff', () => {

  it('example 1', () => {
    const flockA = 4;
    const flockB = 2;
    const flockC = 0;
    const result = add(multiply(flockB, add(flockA, flockC)), multiply(flockA, flockB));  // (2 * (4 + 0)) + (4 * 2) == 16
    expect(result).toBe(16);
  });

  type couplet<A> = [ A, A ];
  type triplet<A> = [ A, A, A ];
  type mathOp<A> = (x: A, y: A) => A;
  type binaryFunc<A> = (op: mathOp<A>, x: A, y: A) => boolean;
  type ternaryFunc<A> = (op: mathOp<A>, x: A, y: A, z: A) => boolean;
  const testMathPropertyBinary = <A>(f: binaryFunc<A>, op: mathOp<A>, v: couplet<A>) => f(op, v[0], v[1]);
  const testMathPropertyTernary = <A>(f: ternaryFunc<A>, op: mathOp<A>, v: triplet<A>) => f(op, v[0], v[1], v[2]);

  const isAssociative = <A>(op: mathOp<A>, x: A, y: A, z: A) => op( op(x, y), z ) === op( x, op(y, z));
  const isCommutative = <A>(op: mathOp<A>, x: A, y: A) => op(x, y) === op(y, x);
  const isDistributive = <A>(f: mathOp<A>, g: mathOp<A>, x: A, y: A, z: A) => f(x, g(y, z)) === g(f(x, y), f(x, z));

  function testAssociative<A>(op: mathOp<A>, vals: triplet<A>): boolean {
    return testMathPropertyTernary(isAssociative, op, vals);
  }

  function testCommutative<A>(op: mathOp<A>, vals: couplet<A>): boolean {
    return testMathPropertyBinary(isCommutative, op, vals);
  }

  describe('properties', () => {
    it('associative add', () => {
      const inputs: triplet<number>[] = [
        [ 1, 2, 3 ],
        [ 0, 1, 2 ],
        [ 2, 3, 0 ],
        [ 1, 5, 99 ],
        [ 100, 1000, 54321 ],
      ];
      const testAssociativeAdd = (vals: triplet<number>) => testAssociative(add, vals);
      expect(inputs.map(testAssociativeAdd)).toEqual(inputs.map(() => true));
    });

    it('commutative add', () => {
      const inputs: couplet<number>[] = [
        [ 0, 0 ],
        [ 1, 1 ],
        [ 0, 1 ],
        [ 1, 0 ],
        [ 3, 5 ],
        [ -1, 5 ],
        [ 9, 999 ],
      ];
      const testCommutativeAdd = (vals: couplet<number>) => testCommutative(add, vals);
      expect(inputs.map(testCommutativeAdd)).toEqual(inputs.map(() => true));
    });

    it('identity add', () => {
      const inputs: number[] = [ 0, 1, 2, 3, 5, -1, -2, -3, -5 ];
      const testIdentityAdd = (val: number) => add(val, 0) === val;
      expect(inputs.map(testIdentityAdd)).toEqual(inputs.map(() => true));
    });

    it('associative multiply', () => {
      const inputs: triplet<number>[] = [
        [ 1, 2, 3 ],
        [ 0, 1, 2 ],
        [ 2, 3, 0 ],
        [ 1, 5, 99 ],
        [ 100, 1000, 54321 ],
      ];
      const testAssociativeMult = (vals: triplet<number>) => testAssociative(multiply, vals);
      expect(inputs.map(testAssociativeMult)).toEqual(inputs.map(() => true));
    });

    it('commutative multiply', () => {
      const inputs: couplet<number>[] = [
        [ 0, 0 ],
        [ 1, 1 ],
        [ 0, 1 ],
        [ 1, 0 ],
        [ 3, 5 ],
        [ -1, 5 ],
        [ 9, 999 ],
      ];
      const testCommutativeMult = (vals: couplet<number>) => testCommutative(multiply, vals);
      expect(inputs.map(testCommutativeMult)).toEqual(inputs.map(() => true));
    });

    it('identity multiply', () => {
      const inputs: number[] = [ 0, 1, 2, 3, 5, -1, -2, -3, -5 ];
      const testIdentityMult = (val: number) => multiply(val, 1) === val;
      expect(inputs.map(testIdentityMult)).toEqual(inputs.map(() => true));
    });

    it('not distributive add(multiply())', () => {
      const inputs: triplet<number>[] = [
        [ 1, 2, 3 ],
        [ 0, 1, 2 ],
        [ 2, 3, 0 ],
        [ 1, 5, 99 ],
        [ 100, 1000, 54321 ],
      ];
      const testDistributiveAddMult = (val: triplet<number>) => isDistributive(add, multiply, val[0], val[1], val[2]);
      expect(inputs.map(testDistributiveAddMult)).not.toEqual(inputs.map(() => true));    // notice the "not" in this line
    });

    it('distributive multiply(add())', () => {
      const inputs: triplet<number>[] = [
        [ 1, 2, 3 ],
        [ 0, 1, 2 ],
        [ 2, 3, 0 ],
        [ 1, 5, 99 ],
        [ 100, 1000, 54321 ],
      ];
      const testDistributiveMultAdd = (val: triplet<number>) => isDistributive(multiply, add, val[0], val[1], val[2]);
      expect(inputs.map(testDistributiveMultAdd)).toEqual(inputs.map(() => true));
    });

  });
});