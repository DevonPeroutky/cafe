import React, {useEffect} from 'react';
import {ChatTextArea} from "@/app_components/chat/components/ChatTextArea.tsx";
import {useRecoilState} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import {Status} from "@/data/types.ts";
import {base64StringToFile} from "@/utils.ts";
import {usePostMessage} from "@/data/client/image.tsx";
import ChatMessageList from "@/app_components/chat/ChatMessageList.tsx";

const ChatUI: React.FC = () => {
  const postMessage = usePostMessage();
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)
    console.log(`ROASTS: `, roasts)
    console.log(pendingRoast)

    if (pendingRoast) {
      postMessage(pendingRoast.id, {
        prompt: pendingRoast.prompt,
        systemPrompt: pendingRoast.systemPrompt,
        topP: pendingRoast.topP,
        temperature: pendingRoast.temperature,
        maxNewTokens: pendingRoast.maxNewTokens,
        imageFile: pendingRoast.imageSrc ? base64StringToFile(pendingRoast.imageSrc) : undefined,
        lora: pendingRoast.lora
      })
    }
  }, [roasts]);

  return (
      <div className="flex flex-col p-4 h-screen min-w-[50%] max-w-[750px] gap-y-4">
        <ChatMessageList />
        <div className="flex w-full">
          <ChatTextArea />
        </div>
      </div>
  );
};

export default ChatUI;