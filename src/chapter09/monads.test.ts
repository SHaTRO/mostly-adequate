
import * as fs from 'fs';
import { flow } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { head } from '../chapter07/stringutil';
import { Maybe } from '../chapter08/tupperware';

import { safeAddressProp, addressesProp, UserRecord } from './monads';

describe('Pointy Functor Factories', () => {

  const readfile = (filename: string): IO.IO<string> => () => fs.readFileSync(filename, 'utf-8');
  const print = <X>(x: X): IO.IO<X> => () => {
    console.log(x);
    return x;
  };

  describe('Mixing metaphors: monadic onion', () => {

    const cat = flow(
      readfile,
      IO.map(print)
    );

    it('space burrito', () => {
      const c = cat('./fixtures/testdata.txt');
      const v = c()();
      expect(v).toContain('This is some test data.');
    });

    it('trapped burrito', () => {
      const catFirstChar = flow(
        cat,
        IO.map(IO.map(head))
      );
      const c = catFirstChar('./fixtures/testdata.txt');
      const v = c()();
      expect(v).toEqual('T');
    });

    it('nested functors', async () => {
      const mmo = Maybe.of(Maybe.of('nunchucks'));
      const m = mmo.join();
      expect(m.isJust).toBeTruthy();
      expect(m.value).toEqual('nunchucks');

      const ooo = O.of(O.of('nunchucks'));
      const o = O.flatten(ooo);
      expect(O.isSome(o)).toBeTruthy();
      expect(O.isSome(o) && o.value).toEqual('nunchucks');

      const ioio = IO.of(IO.of('pizza'));
      const i = IO.flatten(ioio);
      expect(i()).toEqual('pizza');

      const ttt = T.of(T.of(T.of('sewers')));
      const tt = T.flatten(ttt);
      expect(await (await tt())()).toEqual('sewers');
    });

  });

  describe('The Onion', () => {
    const userData: UserRecord = {
      name: 'John Q. Tester',
      addresses: [
        {
          street: '123 Main St.',
          street2: '',
          city: 'Nowhere',
          state: 'CA',
          zip: '01234',
        },
      ],
      phone: '212-555-1212',
      mobile: '212-555-3333',
    };
    const userDataNoAddresses = {
      ...userData,
      addresses: [],
    };

    it('use flatten (a.k.a join) to unwrap', () => {
      const peelTheOnion: (u: UserRecord) => O.Option<string> = flow(
        O.fromNullable,
        O.map(addressesProp.get),
        O.map(RA.head),
        O.flatten,
        O.map(safeAddressProp('street')),
        O.flatten
      );
      expect(peelTheOnion(userDataNoAddresses)).toEqual(O.none);
      expect(peelTheOnion(userData)).toEqual(O.some('123 Main St.'));
    });
  });

  describe('Monadic chain', () => {
    const cat = flow(
      readfile,
      IO.chain(print)
    );

    it('chained space burrito', () => {
      const c = cat('./fixtures/testdata.txt');
      const v = c();
      expect(v).toContain('This is some test data.');
    });

    it('chained chained space burrito', () => {
      const catFirstChar = flow(
        cat,
        IO.map(head)
      );
      const c = catFirstChar('./fixtures/testdata.txt');
      const v = c();
      expect(v).toEqual('T');
    });

    it('Chain St.', () => {
      const userData: UserRecord = {
        name: 'John Q. Tester',
        addresses: [
          {
            street: '123 Main St.',
            street2: '',
            city: 'Nowhere',
            state: 'CA',
            zip: '01234',
          },
        ],
        phone: '212-555-1212',
        mobile: '212-555-3333',
      };
      const userDataNoAddresses = {
        ...userData,
        addresses: [],
      };

      const cutTheOnion: (u: UserRecord) => O.Option<string> = flow(
        O.fromNullable,
        O.map(addressesProp.get),
        O.chain(RA.head),
        O.chain(safeAddressProp('street')),
      );
      expect(cutTheOnion(userDataNoAddresses)).toEqual(O.none);
      expect(cutTheOnion(userData)).toEqual(O.some('123 Main St.'));
    });

  });

});