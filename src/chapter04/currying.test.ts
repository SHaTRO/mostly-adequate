
import { add, filter, match, replace } from './currying';

describe('currying', () => {

  const increment = add(1);
  const decrement = add(-1);
  const subtractPostfix = (x:number) => add(-x);
  const add10 = add(10);

  it('increment/decrement', () => {
    expect(increment(3)).toBe(4); 
    expect(increment(-2)).toBe(-1);
    expect(decrement(3)).toBe(2);
    expect(decrement(-2)).toBe(-3);
  });

  it('subtractPostfix', () => {
    expect(subtractPostfix(3)(4)).toBe(1);   // 4 - 3 = 1
    expect(subtractPostfix(-3)(3)).toBe(6);  // 3 - (-3) = 6
  });

  it('add 10', () => {
    expect(add10(10)).toBe(20);
  });

  const hasLetterR = match(/r/g);
  it('match', () => {
    expect(match(/r/g)('hello world')).toEqual([ 'r' ]);
    expect(hasLetterR('hello world')).toEqual([ 'r' ]);
    expect(hasLetterR('hello world')).toBeTruthy();
    expect(hasLetterR('just j and s and t etc')).toBe(null);
    expect(hasLetterR('just j and s and t etc')).toBeFalsy();
  });

  const removeStringsWithoutRs = filter(hasLetterR);
  it('filter', () => {
    const rword = 'rock and roll';
    const nonRword = 'smooth jazz';
    const inputs = [ rword, nonRword ];
    expect(filter(hasLetterR)(inputs)).toEqual([ rword ]);
    expect(removeStringsWithoutRs(inputs)).toEqual([ rword ]);
  });

  const noVowels = replace(/[aeiou]/ig);
  const censored = noVowels('*');
  it('replace', () => {
    expect(censored('Purple Rain')).toBe('P*rpl* R**n');
  });

});
