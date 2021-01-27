
import * as util from 'util';

export const match = (regex: RegExp|string) => (s: string) => !!s.match(regex);

export class Container<T> {
  $value: T;
  constructor(x: T) {
    this.$value = x;
  }

  map<B>(f: (a: T) => B) {
    return Container.of(f(this.$value));
  }

  static of<X>(x: X): Container<X> {
    return new Container<X>(x);
  }

}


export class Maybe<T> {
  $value: T;
  constructor(x: T) {
    this.$value = x;
  }

  get value(): T {
    return this.$value;
  }

  get isNothing(): boolean {
    return this.$value === null || this.$value === undefined;
  }

  get isJust(): boolean {
    return !this.isNothing;
  }

  [util.inspect.custom](): string {
    return this.isNothing ? 'Nothing' : `Just(${util.inspect(this.$value)})`;
  }

  static of<X>(x: X): Maybe<X> {
    return new Maybe(x);
  }

  map<B>(fn: (a: T) => B): Maybe<T>|Maybe<B> {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  ap<B>(f: Maybe<T>) {
    return this.isNothing ? this : f.map(this.$value as unknown as <X>(a: X) => B);
  }

  chain<B>(fn: (x: T) => B): B|Maybe<B>|T|Maybe<T> {
    return this.map<B>(fn).join();
  }

  join(): Maybe<T>|T {
    return this.isNothing ? this : this.$value;
  }
}
