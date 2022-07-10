
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { Lens } from 'monocle-ts';

export type AddressRecord = {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
};

export type UserRecord = {
  name: string;
  addresses: AddressRecord[];
  phone: string;
  mobile: string;
};

const addressProp = Lens.fromProp<AddressRecord>();
export const safeAddressProp = (p: keyof AddressRecord) => (a: undefined|AddressRecord): O.Option<string> => pipe(
  a ? addressProp(p).get(a) : undefined,
  O.fromNullable,
  O.chain(O.fromPredicate((s) => s!='')),
);

const userProp = Lens.fromProp<UserRecord>();
export const addressesProp = userProp('addresses');

