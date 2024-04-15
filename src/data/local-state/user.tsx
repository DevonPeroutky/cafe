import {atom} from "recoil";
import { recoilPersist } from 'recoil-persist'
import { v4 as uuidv4 } from "uuid";

const { persistAtom } = recoilPersist({
  key: 'recoil-persist', // this key is using to store data in local storage
  storage: localStorage, // configure which storage will be used to store the data
  converter: JSON // configure how values will be serialized/deserialized in storage
})

export const userState = atom<string>({
  key: 'userId',
  default: "devon",
  effects_UNSTABLE: [persistAtom],
});