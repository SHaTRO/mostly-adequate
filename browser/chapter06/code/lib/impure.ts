
import { isRight } from 'fp-ts/Either';
import $ from 'jquery';

import { getURL } from './fetchJson';

export const Impure = {
  trace: (tag: string) => (x: any) => { console.log(tag, x); return x; },
  error: (tag: string) => (x: any) => { console.error(`${tag}`, x); },
  getJSON: 
    <C extends Function>(callback: C) => 
    (url: URL) => 
    getURL<Error>(url)
      .then(
        (e) => 
        isRight(e) ? callback(e.right) : Impure.error('fetch error')(e.left)).catch(),
  setHtml: (sel: string) => (html: JQuery<HTMLElement>[]) => $(sel).append(html)
};
