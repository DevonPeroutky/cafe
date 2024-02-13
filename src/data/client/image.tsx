import {base64StringToFile} from "../../utils";
import {InferenceProps, Status} from "../types";
import {useRecoilState} from "recoil";
import {imageState} from "../local-state/images";
import {API_ENDPOINT} from "@/data/client/constants.ts";

export const useUploadImage = () => {
  const [roasts, setRoasts] = useRecoilState(imageState);

  return async (inference_props: InferenceProps) => {
    const { imageFile, prompt, systemPrompt, topP, temperature, maxNewTokens } = inference_props

    const formData = new FormData();
    formData.append('file', imageFile!);

    try {
      const response = await fetch(`${API_ENDPOINT}/uploadfile?prompt=${prompt}&system_prompt=${systemPrompt}&temperature=${temperature}&top_p=${topP}&max_new_tokens=${maxNewTokens}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);

        // filter out the roast that is in the pending state
        const existingRoasts = roasts.slice(0, -1);

        // Create a new array containing only the last element
        const pendingRoast = roasts[roasts.length - 1];

        if (pendingRoast.status !== Status.Pending) {
          const message = "Roast is in state " + pendingRoast.status + "expected PENDING"
          console.error('Assertion failed:', message);
          throw new Error(message || 'Assertion failed');
        }

        setRoasts([...existingRoasts, {...pendingRoast, status: Status.Success, augmented_roast: data.augmented_response, basic_roast: data.basic_response }])

        return data
      } else {
        console.error('Server error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export const useUploadImageWithStreamingResponse = () => {
    const [roasts, setRoasts] = useRecoilState(imageState);

    return async (imageSrc: string, filename =  'image.jpeg', mimeType = 'image/jpeg') => {
      const uploadFile = base64StringToFile(imageSrc, filename, mimeType)
      console.log(roasts)

      if (imageSrc) {
        console.log(imageSrc)
        const formData = new FormData();
        formData.append('file', uploadFile);

        const res = await fetch('http://34.146.237.185:40000/worker_get_status', {  method: 'POST' })
        const data = await res.json()
        console.log(data)

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