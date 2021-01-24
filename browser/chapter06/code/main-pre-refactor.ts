
import { flow } from 'fp-ts/function';

import { Impure } from './lib/impure';
import { url, render } from './functions/pre-refactor';

const app = flow(url, Impure.getJSON(render) );
app('cats');
