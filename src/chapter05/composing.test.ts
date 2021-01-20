
import { flow, pipe } from 'fp-ts/function';
import { exclaim, toLowerCase, toUpperCase, head, headS, replace, reverse, intercalate, map, split } from './composing';


describe('composition', () => {
  // note: flow() is left-to-right instead of right-to-left, so we reverse function order from compose()
  const shout = flow(toUpperCase, exclaim);
  it('shout', () => {
    expect(shout('there ought to be clowns')).toBe('THERE OUGHT TO BE CLOWNS!');
  });

  const last = flow(reverse, head);
  it('slow last', () => {
    expect(last(['a', 'b', 'c'])).toBe('c');
  })

  const lastUpper = <A extends string>(x: A[]) => pipe(x, flow(reverse, head, toUpperCase));
  const loadLastUpperAssociative = <A extends string>(x: A[]) => pipe(x, flow(lastUpper, exclaim));
  const loudLastUpperAlt = <A extends string>(x: A[]) => pipe(x, flow(last, shout));
  const loudLastUpper = <A extends string>(x: A[]) => pipe(x, flow(reverse, head, toUpperCase, exclaim));
  it('last upper', () => {
    const input = [ 'jab', 'hook', 'uppercut' ];
    expect(lastUpper(input)).toBe('UPPERCUT');
    expect(loudLastUpper(input)).toBe('UPPERCUT!');
    expect(loudLastUpperAlt(input)).toBe('UPPERCUT!');
    expect(loadLastUpperAssociative(input)).toBe('UPPERCUT!');
  });
});

describe('pointfree', () => {
  const snakeCase = flow(toLowerCase, replace(/\s+/ig)('_'));
  it('snake case', () => {
    expect(snakeCase('Do it now')).toBe('do_it_now');
  });

  const initials = flow(split(' '), map(flow(headS, toUpperCase)), intercalate('. '));
  it('initial', () => {
    expect(initials('john fitzgerald kennedy')).toBe('J. F. K');
  });

  const id = <A>(x: A) => x;
  const truthy = <A>(x: A) => !!x;
  it('identity', () => {
    const identityProperty = <A>(x: A) => flow(id, truthy)(x) === flow(truthy, id)(x) && flow(truthy, id)(x) === truthy(x);
    expect(identityProperty(1) && truthy(1)).toBe(true);
    expect(identityProperty(true) && truthy(true)).toBe(true);
    expect(id(false)).toBe(false);
    expect(truthy(false)).toBe(false);
    expect(flow(id, truthy)(false)).toBe(false);
    expect(flow(truthy, id)(false)).toBe(false);
    expect(identityProperty(false)).toBe(true);
    expect(identityProperty(false) && !truthy(false)).toBe(true);
    expect(identityProperty('a') && truthy('a')).toBe(true);
    expect(identityProperty(undefined) && !truthy(undefined)).toBe(true);
  });
});
