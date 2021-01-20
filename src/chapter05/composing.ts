
export const toUpperCase = <A extends string>(x: A) => x.toUpperCase();
export const toLowerCase = <A extends string>(x: A) => x.toLowerCase();
export const exclaim = <A extends string>(x: A) => `${x}!`;

export type StringOrRegExp = string | RegExp;
export const head = <A>(x: A[]) => x[0];    // note: this is not ideal, we have error/undefined condition if A[] is empty
export const headS = <A extends string>(x: A) => x[0];
export const reverse = <A>(x: A[]) => ([] as A[]).concat(x).reverse();
export const replace = (what: StringOrRegExp) => (replacement: string) => (s: string) => s.replace(what, replacement);
export const map = <T,R>(f: (v: T, i?: number, a?: T[]) => R) => (xs: T[]) => xs.map(f);

export const intercalate = (d: string) => (s: string[]) => s.join(d);
export const split = (what: StringOrRegExp) => (s: string) => s.split(what);
