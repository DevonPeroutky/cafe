import {InferenceProps, Status} from "../types";
import {useSetRecoilState} from "recoil";
import { imageState } from "../local-state/images";
import {API_ENDPOINT} from "@/data/client/constants.ts";


export const useUploadImage = () => {
  const setRoasts = useSetRecoilState(imageState);

  return async (roastId: string, userId: string, inferenceProps: InferenceProps) => {
    const { imageFile, prompt, topP, temperature, maxNewTokens, lora } = inferenceProps

    const formData = new FormData();
    formData.append('file', imageFile!);

    const loraPath = lora ? `&lora=${lora.path}` : ''

    try {
      const response = await fetch(`${API_ENDPOINT}/uploadfile?user_id=${userId}&prompt=${prompt}&temperature=${temperature}&top_p=${topP}&max_new_tokens=${maxNewTokens}${loraPath}`, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (response.ok) {
        const data = await response.json();

        setRoasts((prevRoasts) => {
          const pendingRoast = prevRoasts.find(r => r.id === roastId)
          return [
            ...prevRoasts.filter(r => r.id !== roastId),
            {
              ...pendingRoast!,
              status: Status.Success,
              roast: (data?.augmented_response || ""),
            },
          ]
        });

        return data
      } else {
        setRoasts((prevRoasts) => {
          const pendingRoast = prevRoasts.find(r => r.id === roastId)
          return [
            ...prevRoasts.filter(r => r.id !== roastId),
            {
              ...pendingRoast!,
              status: Status.Failed,
            },
          ]
        });
        console.error('Server error:', response.status, response.statusText);
      }
    } catch (e) {
      setRoasts((prevRoasts) => {
        const pendingRoast = prevRoasts.find(r => r.id === roastId)
        return [
          ...prevRoasts.filter(r => r.id !== roastId),
          {
            ...pendingRoast!,
            status: Status.Failed,
          },
        ]
      });
      console.error('Server error:', e);
    }
  }
}
