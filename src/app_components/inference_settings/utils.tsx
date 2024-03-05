import {z} from "zod";
import {FormSchema} from "@/app_components/inference_settings/schema.tsx";
import {Roast, Status} from "@/data/types.ts";
import {useRecoilState, useRecoilValue} from "recoil";
import {lorasState} from "@/data/local-state/loras.tsx";
import {imageState} from "@/data/local-state/images.tsx";
import { v4 as uuidv4 } from "uuid";


export const useOnSubmit = () => {
  const [roasts, setRoasts] = useRecoilState(imageState);
  const loras = useRecoilValue(lorasState);

  return (data: z.infer<typeof FormSchema>) => {
    const lora = loras.find(l => l.displayName === data.loraName)

    // Resubmit the image with the new inference settings
    setRoasts(currVal => ([...currVal, {
      id: uuidv4(),
      prompt: data.prompt,
      lora: lora,
      systemPrompt: data.systemPrompt,
      fullPrompt: null,
      basicRoast: null,
      augmentedRoast: null,
      imageSrc: data.imageSrc,
      topP: data.topP,
      temperature: data.temperature,
      maxNewTokens: data.maxNewTokens,
      status: Status.Pending,
    } as Roast]));
  }
}

