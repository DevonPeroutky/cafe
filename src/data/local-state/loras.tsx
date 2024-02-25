import {atom} from "recoil";
import {LoraProps, Roast} from "../types";

export const lorasState = atom<LoraProps[]>({
  key: 'loras', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});