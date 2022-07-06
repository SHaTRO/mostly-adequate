import { flow } from 'fp-ts/function';
import { map } from 'fp-ts/lib/Array';
import $ from 'jquery';

import { Impure } from '../lib/impure';
import { mediaItemsProp, mediaUrlProp } from '../lib/media-types';

const host = 'api.flickr.com';
const path = '/services/feeds/photos_public.gne';
const query = (t: string) => `?tags=${t}&format=json&jsoncallback=flickrJsonp`;
export const url = (t: string) => new URL(`https://${host}${path}${query(t)}`);

const img = (src: string) => $('<img />', { src });
const imgElement = flow(Impure.trace('img url'), img);
const mediaUrls = flow(mediaItemsProp.get, Impure.trace('mediaUrls'), map(mediaUrlProp.get));
const images = flow(mediaUrls, Impure.trace('urls'), map(imgElement));
export const render = flow(Impure.trace('render'), images, Impure.setHtml('#js-main'));

// Note: the dependency upon jquery could be moved to Impure entirely by moving the 
// 'img'/'imgElement' stuff there and just providing src urls to Impure.setHtml()
