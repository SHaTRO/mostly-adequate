import { flow, identity } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';
import * as TE from 'fp-ts/TaskEither';

export const idToOption = O.fromNullable;
export const idToIO = flow(identity, IO.of);
export const eitherToTE = TE.fromEither;
export const ioToTE = TE.fromIO;
export const optionToTE = TE.fromOption(() => new Error('none'));
export const arrayToOption = A.head;
