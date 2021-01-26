import { toLowerCase, toUpperCase } from "../chapter05/composing";

export const head = (s: string) => s.length > 0 ? s[0] : '';
export const tail = (s: string) => s.length > 1 ? s.substring(1) : '';


