
import { flow, pipe } from 'fp-ts/lib/function';
import { toLowerCase, toUpperCase } from '../chapter05/composing';
import { head, tail } from './stringutil';


describe('Hindley-Milner', () => {

  // Hindley-Milner type signature
  //   capitalize :: String -> String
  const capitalize = (s: string): string => toUpperCase(head(s)) + toLowerCase(tail(s));

  it('capitalize', () => {
    expect(capitalize('strange')).toBe('Strange');
    expect(capitalize('Bonus')).toBe('Bonus');
  });


  //   strLength :: String -> Number
  const strLength = (s: string): number => s.length;

  it('strLength', () => {
    expect(strLength('apple')).toBe(5);
    expect(strLength('')).toBe(0);
  });


  //   join :: String -> [String] -> String
  const join = (delimiter: string) => (arr: string[]): string => arr.join(delimiter);

  it('join', () => {
    const input1 = [ 'X', 'and', 'Z' ];
    expect(join('.')(input1)).toBe('X.and.Z');
    const input2 = [ 'A' ];
    expect(join(',')(input2)).toBe('A');
    const input3 = [] as string[];
    expect(join('|')(input3)).toBe('');
  });


  //   match :: Regex -> String -> String[]
  const match = (re: RegExp) => (s: string) => s.match(re);

  it('match', () => {
    const input = 'mississippi';
    expect( match(/[aeiou]/ig)(input) ).toEqual([ 'i', 'i', 'i', 'i' ]);
    expect( match(/([a-z])\1/ig)(input) ).toEqual([ 'ss', 'ss', 'pp' ]);
  });


  //   replace :: Regex -> String -> String -> String
  const replace = (re: RegExp) => (sub: string) => (s:string): string => s.replace(re, sub);
  
  it('replace', () => {
    expect( replace(/r/)('ch')('pear') ).toBe('peach');
    expect( replace(/ok/)('at')('book') ).toBe('boat');
  });


  //   id :: a -> a
  const id = <A>(a: A) => a;

  it('id', () => {
    expect( id('cherry') ).toBe('cherry');
    expect( id(4) ).toBe(4);
  });
  

  //   map :: (a -> b) -> [a] -> [b]
  const map = <A,B>(f: (a: A) => B) => (arrA: A[]): B[] => arrA.map(f);

  it('map', () => {
    expect( map(head)(['john', 'quincy', 'adams']) ).toEqual(['j', 'q', 'a']);
    expect( map(tail)(['soak', 'cart', 'kale', 'dear']) ).toEqual(['oak', 'art', 'ale', 'ear']);
  });


  //   arrayHead :: [a] -> a
  const arrayHead = <A>(arr: A[]): A => arr[0];

  it('headNew', () => {
    expect( arrayHead(['good', 'bad', 'ugly']) ).toBe('good');
  });


  //   filter :: (a -> Bool) -> [a] -> [a]
  const filter = <A>(f: (a: A) => boolean) => (arr: A[]): A[] => arr.filter(f);
  //   startsWithA :: String -> boolean
  const startsWith = (char: string) => (s: string) => (toLowerCase(head(s)) === toLowerCase(char));

  it('filter', () => {
    expect( filter(startsWith('A'))([ 'Adam', 'Eve', 'Apple', 'Snake' ]) ).toEqual([ 'Adam', 'Apple' ]);
  });


  //   reduce :: ((b, a) -> b) -> b -> [a] -> b
  const reduce = <A, B>(f: (b: B, a: A) => B) => (x: B) => (arr: A[]): B => arr.reduce(f, x);

  it('reduce', () => {
    expect( reduce((a:number, b:number) => a + b)(0)([ 0, 1, 2, 3 ]) ).toBe(6);
  });


  type MapFunc<A, B> = (a: A) => B;
  type FilterFunc<A> = (a: A) => boolean;
  it('parametricity', () => {

    // map with head
    const longWay = <A,B>(f: MapFunc<A,B>) => (arr: A[]): B => pipe(arr, flow(map(f), arrayHead));
    const shortWay = <A,B>(f: MapFunc<A,B>) => (arr: A[]): B => pipe(arr, flow(arrayHead, f));
    expect( longWay(toUpperCase)(['a', 'b', 'c']) ).toEqual('A');   // value (concept) check
    expect( longWay(toLowerCase)(['a', 'b', 'c']) ).toEqual( shortWay(toLowerCase)(['a', 'b', 'c']) );    // free theorem

    // filter with map
    const longerWay = <A,B>(f: MapFunc<A,B>) => (p: FilterFunc<B>) => (arr: A[]): B[] => pipe(arr, flow(map(f), filter(p)));
    const shorterWay = <A,B>(f: MapFunc<A,B>) => (p: FilterFunc<B>) => (arr: A[]): B[] => pipe(arr, flow(filter(flow(f,p)), map(f)));
    expect( longerWay(toUpperCase)(startsWith('Z'))([ 'zebra', 'elephant', 'zero', 'one' ]) ).toEqual([ 'ZEBRA', 'ZERO' ]);
    expect( longerWay(toUpperCase)(startsWith('Z'))([ 'zebra', 'elephant', 'zero', 'one' ]) )
      .toEqual(shorterWay(toUpperCase)(startsWith('Z'))([ 'zebra', 'elephant', 'zero', 'one' ]) );
  });

  // OPEN QUESTION: How do constraints as per Hindley-Milner get represented in Typescript?  
  // Minimally by "extends" but multiple constraints cannot be defined in that way.
     
});