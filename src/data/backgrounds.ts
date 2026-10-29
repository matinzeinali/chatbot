import flowers from "../assets/backgrounds/flowers.jpg";
import mountains from "../assets/backgrounds/mountains.jpg";
import street from "../assets/backgrounds/street.jpg";
import fantasy from "../assets/backgrounds/abstract.jpg";

export interface Background {
  id: string;
  name: string;
  src: string;
}

export const backgrounds: Background[] = [
  { id: "flowers", name: "Flowers", src: flowers },
  { id: "mountains", name: "Mountains", src: mountains },
  { id: "street", name: "Street", src: street },
  { id: "fantasy", name: "Fantasy island", src: fantasy },
];

export const DEFAULT_BACKGROUND_ID = backgrounds[0].id;

export const BLUR_MIN = 0;
export const BLUR_MAX = 40;
export const DEFAULT_BLUR = 10;
