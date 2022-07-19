import { pipe } from 'fp-ts/function';
import * as RNA from 'fp-ts/ReadOnlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';

import { arrayToOption, eitherToTE, idToIO, idToOption, ioToTE, optionToTE } from './natural';

describe('not the natural way', () => {

  const getValue = (s: string) => T.of(O.of(s ? `The punch line is ${s}` : s));
  const postComment = (c: string) => T.of(c);   
  const validate = (c: string) => E.fromPredicate((c) => c !== '', () => new Error('validation error'))(c);

  it('situational comedy', async () => {
    const result = pipe(
      getValue('to get to the other side'),
      T.map(O.map(validate)),
      T.map(O.map(E.map(postComment))),
    );
    const throwError = () => { throw new Error(); };
    expect(
      await E.getOrElseW(throwError)(O.getOrElseW(throwError)(await result()))()
    ).toEqual('The punch line is to get to the other side');
  });
  
});

describe('Natural transformations', () => {
  
  it('idToOption', () => {
    expect(idToOption(null)).toEqual(O.none);
    expect(idToOption(15)).toEqual(O.some(15));
    expect(idToOption('foo')).toEqual(O.some('foo'));
  });
  
  it('idToIO', () => {
    expect( idToIO(null)() ).toBeNull();
    expect( idToIO(5)() ).toEqual(5);
    expect( idToIO('apple')() ).toEqual('apple');
    expect( idToIO(O.some('bar'))() ).toEqual(O.some('bar'));
  });
  
  it('eitherToTE', async () => {
    expect( E.isLeft( await eitherToTE(E.left('error string'))() ) ).toBeTruthy();
    expect( await eitherToTE(E.right('something'))() ).toEqual(E.right('something'));
  });
  
  it('ioToTE', async () => {
    expect( await ioToTE( IO.of('foo') )() ).toEqual(E.right('foo'));
  }); 
  
  it('optionToTE', async () => {
    expect( E.isLeft(await optionToTE( O.none )() )).toBeTruthy();
    expect( await optionToTE(O.some('foo'))() ).toEqual(E.right('foo'));
  });
  
  it('arrayToOption', () => {
    expect( arrayToOption([]) ).toEqual(O.none);
    expect( arrayToOption(['foo', 'bar']) ).toEqual(O.some('foo'));
  });

  it('feature envy', () => {
    // second of two natural transformations so we can do our stuff and still get our result
    // cleanly composed pipe with little or not nesting (closest we have is a map)
    const arrayFromOptionRNA = <A>(o: O.Option<readonly A[]>) => O.match(() => [], (as: readonly A[]) => [...as])(o);
    const result = pipe(
      ['a', 'b', 'c'],     // we have an array first
      RNA.fromArray,       // naturally transform to ReadOnlyNonEmptyArray
      O.map(RNA.init),     // do our optional RNA stuff (drop the last element)
      arrayFromOptionRNA,  // naturally transform back to an array
    );
    expect(result).toEqual([ 'a', 'b' ]);
  });

});
