import {atom, selector} from "recoil";
import {Roast, Status} from "../types";

export const imageState = atom<Roast[]>({
  key: 'images', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});


// recoil selector for the last Roast in the imageState
export const pendingRoastState = selector({
  key: 'pendingRoastState',
  get: ({get}) => {
    const roasts = get(imageState);
    const pendingRoast = roasts.filter(r => r.status === Status.Pending);
    if (pendingRoast && pendingRoast.length > 1) {
      throw new Error("Should only ever be one pending roast at a time")
    }
    return pendingRoast && pendingRoast.pop()
  },
});

export const finalizedRoastState = selector({
  key: 'finalizedRoastState',
  get: ({get}) => {
    const roasts = get(imageState);
    return roasts.filter(r => r.status !== Status.Pending);
  },
});
