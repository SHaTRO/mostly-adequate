
import { Either, left, right } from 'fp-ts/Either';
import fetchJsonp from 'fetch-jsonp';

export function fetchJsonResult(url: URL): Promise<object> {
  return fetchJsonp(url.href, { jsonpCallbackFunction: 'flickrJsonp' })
    .then(res => res.json())
}

export async function getURL<E>(url: URL): Promise<Either<E, object>> {
  try {
    const json = await fetchJsonResult(url);
    return right( json );
  } catch (err) {
    return left(err);
  }
}
