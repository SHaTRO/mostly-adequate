
import { match, Container, Maybe } from './tupperware';
import * as util from 'util';
import { Lens } from 'monocle-ts';

import { split } from 'fp-ts-string';
import { pipe, flow, identity } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as IO from 'fp-ts/lib/IO';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as fs from 'fs';
import D from 'od';
  
describe('tupperware', () => {
  it('container', () => {
    const container1 = Container.of(3);
    const container2 = Container.of('pickle');
    const container3 = Container.of(Container.of({ color: 'purple' }));
    // opening the container, but only to validate it
    expect( container1.$value ).toBe(3);
    expect( container2.$value ).toBe('pickle');
    expect( container3.$value.$value.color ).toBe('purple');
    console.log(`container1: ${util.inspect(container1)}`);
  });

  it('first functor', () => {
    expect( Container.of(3).map( a => a+4 ).$value ).toBe(7); 
    expect( Container.of('peanut butter').map( a => `${a} and jelly` ).$value ).toBe('peanut butter and jelly');
    expect( Container.of('He\'s').map<string>( (s) => s + ' gone' ).map<number>( (s: string) => s.length ).$value ).toBe(9);
  });

  it('maybe so / maybe not', () => {
    const maybeSo = Maybe.of('John Malkovich').map(match(/a/ig));
    const maybeNot = Maybe.of(null as unknown as string).map(match(/a/ig));
    expect(maybeSo.isJust).toBe(true);
    expect(maybeNot.isJust).toBe(false);
    expect(maybeSo.isNothing).toBe(false);
    expect(maybeNot.isNothing).toBe(true);
    expect(maybeSo.join()).toBe(true);
    expect(maybeNot.join()).toEqual(Maybe.of(null));
  });

  it('a maybe chain', () => {
    type Person = {
      name: string;
      age?: number;
    };
    const age: Lens<Person, number|undefined> = Lens.fromProp<Person>()('age');
    const batman: Person = { name: 'Bruce Wayne' };
    const dinah: Person = { name: 'Dinah', age: 14 };
    expect(Maybe.of(batman).map(age.get).isNothing).toBe(true);
    expect(Maybe.of(dinah).map(age.get).isJust).toBe(true);
  });

  it('now with fp-ts, Option', () => {
    const maybeSo = pipe('John Malkovitch', O.fromNullable, O.map(match(/a/ig))); 
    const maybeNot = pipe(undefined, O.fromNullable, O.map(match(/a/ig)));
    expect(maybeSo).toEqual(O.some(true));
    expect(maybeNot).toEqual(O.none);
  });

  it('now with fp-ts, Option chain', () => {
    type Person = {
      name: string;
      age?: number;
    };
    const aquaman: Person = { name: 'Arthur Curry' };
    const sillyboy: Person = { name: 'Rufus', age: 10 };
    const getAge = Lens.fromProp<Person>()('age').get;
    const getAgeK = O.chainNullableK(getAge); // Monadic combinator: chain + fromNullable
    expect(pipe(aquaman, O.of, getAgeK, O.isNone)).toEqual(true);
    expect(pipe(sillyboy, O.of, getAgeK, O.isSome)).toEqual(true);
  });

  it('Use case - function fails to return result', () => {
    const safeHead = <T>(arr: T[]) => O.fromNullable(arr[0]);
    expect(O.isNone(safeHead([]))).toBe(true);
    type Address = { street: string, number: number };
    type Addresses = { addresses: Address[] };
    const propAddresses = Lens.fromProp<Addresses>()('addresses');
    const propStreet = Lens.fromProp<Address>()('street');
    const streetName = (list: Addresses) => pipe(list, propAddresses.get, safeHead, O.chainNullableK(propStreet.get));
    expect(streetName({ addresses: [] })).toEqual(O.none);
    expect(streetName({ addresses: [{ street: 'Shakedown St.', number: 1965 }]})).toEqual(O.some('Shakedown St.'));
  });

  describe('Use case - function returns none to indicate failure (using Option)', () => {
    type Account = { balance: bigint };
    const withdraw = (amount: bigint) => flow(
      O.fromPredicate( (a: Account) => a.balance >= amount ),
      O.map( (a): Account => ({ balance: a.balance - amount }) )
    );
    const updateLedger: (a: Account) => Account = identity;
    const remainingBalance = (acct: Account) => `Your balance is $${acct.balance.toString()}`;
    const finishTransaction = flow(updateLedger, remainingBalance);

    it('Use case - function returns none to indicate failure', () => {
      const getTwenty = flow(withdraw(BigInt(20)), O.map(finishTransaction));
      expect(getTwenty({ balance: BigInt(200) })).toEqual(O.some('Your balance is $180'));
      expect(getTwenty({ balance: BigInt(19) })).toEqual(O.none);
    });

    it('Use case - composed with valid or default result', () => {
      const insufficientBalance = () => 'Insufficient Balance';
      const getTwenty = flow(withdraw(BigInt(20)), O.map(finishTransaction), O.getOrElse(insufficientBalance));
      expect(getTwenty({ balance: BigInt(200) })).toBe('Your balance is $180');
      expect(getTwenty({ balance: BigInt(19) })).toBe('Insufficient Balance');
    });

  });

  describe('Pure Error Handling', () => {
    it('right brain / left rain', () => {
      const rightBrain = pipe('rain', E.of, E.map( (s: string) => `b${s}`));
      expect(rightBrain).toEqual(E.right('brain'));
      const leftRain = pipe(E.left('rain'), E.map( (s) => `It's gonna ${s}, better bring your umbrella!`));
      expect(leftRain).toEqual(E.left('rain'));
    });

    it('look inside and roll your eyes', () => {
      type Server = { host: string, port: number };
      const hostLens = Lens.fromProp<Server>()('host');
      const lookInside = pipe( { host: 'localhost', port: 80 }, E.of, E.map(hostLens.get) );
      expect(lookInside).toEqual(E.right('localhost'));
      const rollYourEyes = pipe( E.left('roll eyes...'), E.map(hostLens.get));
      expect(rollYourEyes).toEqual(E.left('roll eyes...'));
    });

    type User = { birthDate: string };
    const getAge = (now: Date) => (user: User) => {
      const birthDate = (d: string) => E.tryCatch(() => D.of(d), () => 'invalid date');
      const age = (bd: Date) => D.distance('year')(bd)(now);
      return pipe(user.birthDate, birthDate, E.map(age)); 
    };
    const getNewAge = getAge(new Date('2020-11-04'));
    const fortune = flow((a: number) => a+1, (n: number) => n.toString(), (s: string) => `If you survive you will be ${s}`);

    it('ageless', () => {
      expect(getNewAge({ birthDate: '1969-06-30' })).toEqual(E.right(51));
      expect(getNewAge({ birthDate: 'July 4, 1775' })).toEqual(E.left('invalid date'));
      const zoltar = flow(getNewAge, E.map(fortune));
      expect(zoltar({ birthDate: '2005-12-12' })).toEqual(E.right('If you survive you will be 16'));
      expect(zoltar({ birthDate: 'balloons!' })).toEqual(E.left('invalid date'));
    });

    it('little either is bimap, but not really', () => {
      const zoltar = flow(getNewAge, E.bimap(identity, fortune), E.getOrElse(identity));
      expect(zoltar({ birthDate: '2005-12-12' })).toEqual('If you survive you will be 16');
      expect(zoltar({ birthDate: 'balloons!' })).toEqual('invalid date');
    });
  });

  describe('Old MacDonald\'s side effects', () => {
    const urls = [
      'https://www.googleapis.com/customsearch/v1?key=123456&cx=politics&q=apples',
      'https://www.googleapis.com/customsearch/v1?key=123456&cx=politics&q=oranges',
      'https://www.googleapis.com/customsearch/v1?key=123456&cx=politics&q=peaches',
      'https://www.googleapis.com/customsearch/v1?key=123456&cx=politics&q=pears',
      'https://www.googleapis.com/customsearch/v1?key=123456&cx=politics&q=pineapples',
    ];
    const randomUrl = () => urls[Math.floor(Math.random() * urls.length)];

    const keyEquals = (key: string) => (pair: string[]): boolean => 
      pipe(
        pair, 
        A.head, 
        O.map((s: string) => s === key),
        O.fold(() => false, identity),
      );

    it('keyEquals test', () => {
      expect(keyEquals('try')([ 'try', 'this' ])).toBe(true);
      expect(keyEquals('key')([ 'try', 'this' ])).toBe(false);
    });

    it('search term parser', () => {
      const url: IO.IO<string> = IO.fromIO(randomUrl);  // simulate IO with an impure function
      const toPairs = flow(split('&'), A.map(split('=')));
      const params = flow(split('?'), A.last, O.map(toPairs));
      const findParamF = (key: string) => flow(params, O.chain(A.findFirst(keyEquals(key))));
      const findParam = (key: string) => flow(url, findParamF(key), O.chain(A.last));
      expect(flow(findParam('q'), O.isSome)()).toBe(true);
      expect(findParam('x')()).toBe(O.none);
      expect(findParam('key')()).toEqual(O.some('123456'));
      expect(findParam('cx')()).toEqual(O.some('politics'));
    });

  });

  
  describe('Asynchronous tasks', () => {
    const splitRE = (r: RegExp|string) => (s: string) => s.split(r);
    const readFilePromise = util.promisify(fs.readFile);
    const bufferToString = (b: Buffer) => b.toString();

    it('reading file as a task', async () => {
      const readFile = (filename: string): T.Task<Buffer> => () => readFilePromise(filename);
      const linesAsStrings = flow(
        readFile,
        T.map(bufferToString),
        T.map(splitRE(/\r?\n/)),
        T.map(A.head),
      );
      expect(await pipe('fixtures/testdata.txt', linesAsStrings)()).toEqual(O.some('This is some test data.'));
    });

    it('reading file as a task with TaskEither', async () => {
      const readFile = (filename: string): TE.TaskEither<string, Buffer> => TE.tryCatch(() => readFilePromise(filename), String);
      const linesAsStrings = flow(
        readFile,
        TE.map(bufferToString),
        TE.map(splitRE(/\r?\n/)),
        TE.map(A.head),
      );
      expect(await linesAsStrings('./fixtures/testdata.txt')()).toEqual(E.right(O.some('This is some test data.')));
    });
  });

  describe('A little theory', () => {
    const idLaw1 = O.map(identity);
    const idLaw2 = identity;
    it('id laws', () => {
      expect( idLaw1(O.of(4)) ).toEqual(O.some(4));
      expect( idLaw2(O.of(5)) ).toEqual(O.some(5));
    });

    const append = (sx: string) => (s: string) => s + sx;
    const compositionLaw1 = flow(O.map(append(' cruel')), O.map(append(' world!')));
    const compositionLaw2 = O.map(flow(append(' cruel'), append(' world!')));
    it('composition laws', () => {
      expect(compositionLaw1(O.of('Goodbye'))).toEqual(O.some('Goodbye cruel world!'));
      expect(compositionLaw2(O.of('Goodbye'))).toEqual(O.some('Goodbye cruel world!'));
    });
  });

});

