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
              augmentedRoast: (data?.augmented_response || ""),
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


export const usePostMessage = () => {
  const setRoasts = useSetRecoilState(imageState);

  return async (roastId: string, inferenceProps: InferenceProps) => {
    const { imageFile, prompt, systemPrompt, topP, temperature, maxNewTokens, lora } = inferenceProps
    const loraPath = lora ? `&lora=${lora.path}` : '';
    const formData = new FormData();

    console.log(`IMAGE FILE: `, imageFile);
    if (imageFile) {
      formData.append('file', imageFile!);
    }
    const endpoint = `${API_ENDPOINT}/message?prompt=${prompt}&system_prompt=${systemPrompt}&temperature=${temperature}&top_p=${topP}&max_new_tokens=${maxNewTokens}${loraPath}`

    // Append your form data, including prompt, system_prompt, temperature, top_p, max_new_tokens, file, and lora
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const reader = response.body?.getReader();

    while (true) {
      const { value, done } = await reader.read();  // Await the read operation

      if (done) {
        setRoasts((prevRoasts) => {
          const streamingRoast = prevRoasts.find(r => r.id === roastId)
          return [
            ...prevRoasts.filter(r => r.id !== roastId),
            {
              ...streamingRoast!,
              status: Status.Success,
            },
          ]
        });
        break;
      }

      const text = new TextDecoder().decode(value);
      setRoasts((prevRoasts) => {
        const streamingRoast = prevRoasts.find(r => r.id === roastId)
        return [
          ...prevRoasts.filter(r => r.id !== roastId),
          {
            ...streamingRoast!,
            status: Status.Streaming,
            augmentedRoast: (streamingRoast?.augmentedRoast || "") + text,
          },
        ]
      });

    }
  }
}