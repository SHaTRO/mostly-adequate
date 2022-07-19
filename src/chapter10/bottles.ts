import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';

export type NumFnType = (a: number) => (b: number) => number;
export const bottled5: (f: NumFnType) => O.Option<number> = flow(
  O.of,
  O.ap(O.of(3)),
  O.ap(O.of(2))
);

export type BottledFn<A> = (a: A) => (b: A) => A;
export const bottledOption = <A>(a: A, b: A): ((f: BottledFn<A>) => O.Option<A>) => flow(
  O.of,
  O.ap(O.of(a)),
  O.ap(O.of(b)),
);

export const bottledTask = <A>(a: A, b: A): ((f: BottledFn<A>) => T.Task<A>) => flow(
  T.of,
  T.ap(T.of(a)),
  T.ap(T.of(b))
);

