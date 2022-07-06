
export const add = (x:number) => (y:number) => x + y;
export const multiply = (x:number) => (y:number) => x * y;

export type StringOrRegExp = string|RegExp;
export const match = (what: StringOrRegExp) => (s: string) => s.match(what);
export const replace = (what: StringOrRegExp) => (replacement: string) => (s: string) => s.replace(what, replacement);
export const filter = <T>(f: (...args: any[]) => any) => (xs: T[]) => xs.filter(f);
export const map = <T,R>(f: (v: T, i: number, a: T[]) => R) => (xs: T[]) => xs.map(f);
