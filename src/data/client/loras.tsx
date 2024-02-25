import {useRecoilState} from "recoil";
import {API_ENDPOINT} from "@/data/client/constants.ts";
import {lorasState} from "@/data/local-state/loras.tsx";

export const useLoras = () => {
  const [loras, setLoras] = useRecoilState(lorasState)

  return async () => {
    fetch(`${API_ENDPOINT}/lora-checkpoints`)
        .then(response => response.json())
        .then(data =>  {
          setLoras(data)})
        }
}