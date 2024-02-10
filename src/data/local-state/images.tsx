import {atom, RecoilState} from "recoil";
import {Roast} from "../types";

export const imageState = atom<Roast[]>({
  key: 'images', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});