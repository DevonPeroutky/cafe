import {atom, RecoilState, selector} from "recoil";
import {Roast} from "../types";

export const imageState = atom<Roast[]>({
  key: 'images', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});


// recoil selector for the last Roast in the imageState
export const lastRoastState = selector({
  key: 'FilteredTodoList',
  get: ({get}) => {
    const roasts = get(imageState);

    // return last element in the list
    return (roasts.length > 0) ? roasts[roasts.length - 1] : undefined;
  },
});