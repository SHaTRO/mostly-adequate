
import * as fs from 'fs';
import { flow } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { head } from '../chapter07/stringutil';
import { Maybe } from '../chapter08/tupperware';

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
      
      const ioio = IO.of(IO.of( 'pizza' ));
      const i = IO.flatten(ioio);
      expect(i()).toEqual('pizza');
      
      const ttt = T.of(T.of(T.of('sewers')));
      const tt = T.flatten(ttt);
      expect( await (await tt())() ).toEqual('sewers');
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

  });

});