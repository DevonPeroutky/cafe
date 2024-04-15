import {useSetRecoilState} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import {InferenceProps, Roast, Status} from "@/data/types.ts";
import {API_ENDPOINT} from "@/data/client/constants.ts";
import {ChatMessage, ChatMessageT} from "@/app_components/chat/types.ts";

export const useStreamingPostMessage = () => {
  const setRoasts = useSetRecoilState(imageState);

  return async (roastId: string, inferenceProps: InferenceProps) => {
    const { prompt,  topP, temperature, maxNewTokens, lora } = inferenceProps
    const loraPath = lora ? `&lora=${lora.path}` : '';

    const endpoint = `${API_ENDPOINT}/stream-message?prompt=${prompt}&temperature=${temperature}&top_p=${topP}&max_new_tokens=${maxNewTokens}${loraPath}`

    // Append your form data, including prompt, system_prompt, temperature, top_p, max_new_tokens, file, and lora
    const response = await fetch(endpoint, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const reader = response.body?.getReader();

    while (true) {
      const { value, done } = await reader!.read();  // Await the read operation

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
            roast: (streamingRoast?.roast || "") + text,
          },
        ]
      });

    }
  }
}

export const usePostMessage = () => {
  const setRoasts = useSetRecoilState(imageState);

  return async (roastId: string, userId: string, inferenceProps: InferenceProps) => {
    const { prompt, topP, temperature, maxNewTokens, lora } = inferenceProps
    const loraPath = lora ? `&lora=${lora.path}` : ''

    try {
      const response = await fetch(`${API_ENDPOINT}/message?user_id=${userId}&prompt=${prompt}&temperature=${temperature}&top_p=${topP}&max_new_tokens=${maxNewTokens}${loraPath}`, {
        method: 'POST',
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
              roast: (data?.response || ""),
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


export const useLoadConversation = () => {
    return async (user_id: string): Promise<ChatMessageT[]> => {
      try {
        const response = await fetch(`${API_ENDPOINT}/conversation-history?user_id=${user_id}`);

        if (response.ok) {
            const data = await response.json();
            console.log("CONVERSATION DATA: ", data)
            return data as ChatMessageT[];
        } else {
            console.error('Server error:', response.status, response.statusText);
            return []
        }
      } catch (e) {
        console.error('Server error:', e);
        return []
        }
    }
}