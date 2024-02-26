import {base64StringToFile} from "@/utils.ts";
import {InferenceProps, Status} from "../types";
import {useRecoilState, useRecoilValue} from "recoil";
import {finalizedRoastState, imageState, pendingRoastState} from "../local-state/images";
import {API_ENDPOINT} from "@/data/client/constants.ts";

export const useUploadImage = () => {
  const [roasts, setRoasts] = useRecoilState(imageState);
  const pendingRoast = useRecoilValue(pendingRoastState)
  const finalizedRoasts = useRecoilValue(finalizedRoastState)

  return async (inference_props: InferenceProps) => {
    const { imageFile, prompt, systemPrompt, topP, temperature, maxNewTokens, lora } = inference_props

    const formData = new FormData();
    formData.append('file', imageFile!);

    if (!pendingRoast) {
      throw new Error('No pending roast found');
    }

    const loraPath = lora ? `&lora=${lora.path}` : ''

    try {
      const response = await fetch(`${API_ENDPOINT}/uploadfile?prompt=${prompt}&system_prompt=${systemPrompt}&temperature=${temperature}&top_p=${topP}&max_new_tokens=${maxNewTokens}${loraPath}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        setRoasts([...finalizedRoasts, {...pendingRoast!,
          status: Status.Success,
          augmentedRoast: data.augmented_response,
          basicRoast: data.basic_response,
          fullPrompt: data.full_prompt,
        }])

        return data
      } else {
        setRoasts([...finalizedRoasts, {...pendingRoast!,
          status: Status.Failed,
        }])
        console.error('Server error:', response.status, response.statusText);
      }
    } catch (e) {
      setRoasts([...finalizedRoasts, {...pendingRoast!,
        status: Status.Failed,
      }])
      console.error('Server error:', e);
    }
  }
}

export const useUploadImageWithStreamingResponse = () => {
    const [roasts, setRoasts] = useRecoilState(imageState);

    return async (imageSrc: string, filename =  'image.jpeg', mimeType = 'image/jpeg') => {
      const uploadFile = base64StringToFile(imageSrc, filename, mimeType)

      if (imageSrc) {
        const formData = new FormData();
        formData.append('file', uploadFile);

        const res = await fetch('http://34.146.237.185:40000/worker_get_status', {  method: 'POST' })
        const data = await res.json()

        const llava_worker_url = 'http://34.146.237.185:40000/worker_generate_stream'
        return fetch(llava_worker_url, {
          method: 'POST',
          body: formData,
        })
            .then(response => response.body!.pipeThrough(new TextDecoderStream()))
            .then(reader => {
              const streamReader = reader.getReader();

              // Read chunks of data
              streamReader.read().then(({ value, done }) => {
                if (!done) {
                  console.log('Received chunk:', value);
                  // Handle the received data
                }
              });
            });
      }
      else {
        console.error('No file selected');
      }
    }
}