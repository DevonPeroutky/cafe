import React, {useEffect} from 'react';
import {ChatTextArea} from "@/app_components/chat/components/ChatTextArea.tsx";
import {useRecoilState, useRecoilValue} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import {Status} from "@/data/types.ts";
import {base64StringToFile } from "@/utils.ts";
import { useUploadImage} from "@/data/client/image.tsx";
import ChatMessageList from "@/app_components/chat/ChatMessageList.tsx";
import {userState} from "@/data/local-state/user.tsx";

const ChatUI: React.FC = () => {
  const postMessage = useUploadImage();
  const userId = useRecoilValue(userState);
  // const postMessage = usePostMessage();
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)
    console.log(`ROASTS: `, roasts)
    console.log(pendingRoast)

    if (pendingRoast) {
      postMessage(pendingRoast.id, userId, {
        prompt: pendingRoast.prompt,
        topP: pendingRoast.topP,
        temperature: pendingRoast.temperature,
        maxNewTokens: pendingRoast.maxNewTokens,
        imageFile: pendingRoast.imageSrc ? base64StringToFile(pendingRoast.imageSrc) : undefined,
        lora: pendingRoast.lora
      })
    }
  }, [roasts]);

  return (
      <div className="flex flex-col p-4 h-screen md:min-w-[750px] max-w-[750px] gap-y-4">
        <ChatMessageList />
        <div className="flex w-full">
          <ChatTextArea />
        </div>
      </div>
  );
};

export default ChatUI;