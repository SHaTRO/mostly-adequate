import { Lens } from "monocle-ts";

/* Types added so we cna use Lens instead of 'prop' */
export type MediaUrl = {
  m: string,
}
export type MediaInfo = {
  media: MediaUrl,
};
export type MediaResponse = {
  items: MediaInfo[],
};

/* And our Lens defintions */
export const mediaItemsProp: Lens<MediaResponse, MediaInfo[]> = Lens.fromProp<MediaResponse>()('items');
export const mediaUrlProp: Lens<MediaInfo, string> = Lens.fromPath<MediaInfo>()([ 'media', 'm' ]);