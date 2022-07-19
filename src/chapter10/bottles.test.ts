import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { add } from '../chapter04/currying';
import { bottled5, BottledFn, bottledOption, bottledTask } from './bottles';

describe('Applying Applicables', () => {

  it('The pickle jar', () => {
    const result = pipe(
      O.of(2),
      O.chain(two => pipe(
        O.of(3),
        O.map(add(two)))
      ),
    );
    expect(result).toEqual(O.some(5));
  });

  it('Ship in a bottle', () => {
    const result = pipe(
      O.of(2),
      O.map(add),
      O.ap(O.of(3))
    );
    expect(result).toEqual(O.some(5));
  }); 
  
  it('Ships in bottles', async () => {
    const result = pipe(
      O.of(add),
      O.ap(O.of(2)),
      O.ap(O.of(3))
    );
    expect(result).toEqual(O.some(5));
    
    expect(bottled5(add)).toEqual(O.some(5));
    expect(bottledOption(2, 3)(add)).toEqual(O.some(5));
    expect(await bottledTask(2, 3)(add)()).toEqual(5);
  });
 
  it('Lifted Containers', () => {
    const result = pipe(
      O.of(2),
      O.map(add),
      O.ap(O.of(3))
    );
    expect(result).toEqual(O.some(5));
    
    const liftOptionA2 = <A>(g: BottledFn<A>) => (a: O.Option<A>) => (b: O.Option<A>) => pipe(
      a,
      O.map(g),
      O.ap(b)
    );
    expect(liftOptionA2(add)(O.of(2))(O.of(3))).toEqual(O.some(5));

  });
  
  describe('Can Openers', () => {
    
    const liftOptionA2 = <A>(g: BottledFn<A>) => (a: O.Option<A>) => (b: O.Option<A>) => pipe(
      a,
      O.map(g),
      O.ap(b),
    );
    
    const liftTaskA2 = <A>(g: BottledFn<A>) => (a: T.Task<A>) => (b: T.Task<A>) => pipe(
      a,
      T.map(g),
      T.ap(b)
    );

    const taskOfOption = flow(
      O.of,
      T.of,
    );
    
    it('stacked types', async () => {
      const concat = (a: string) => (b: string) => `${a}${b}`;
      const result = liftTaskA2(liftOptionA2(concat))(taskOfOption('Rainy Days and Mondays'))(taskOfOption(' always get me down'));
      expect(await result()).toEqual(O.some('Rainy Days and Mondays always get me down'));
    });

  });
  
});
