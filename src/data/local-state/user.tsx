import {atom} from "recoil";
import { v4 as uuidv4 } from "uuid";

export const userState = atom<string>({
  key: 'userId',
  default: uuidv4(),
});