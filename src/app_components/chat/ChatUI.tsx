import React, {useEffect, useRef} from 'react';
import {ChatTextArea} from "@/app_components/chat/components/ChatTextArea.tsx";
import {useRecoilState} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import ChatMessage from "@/app_components/chat/ChatMessage.tsx";
import RoastDisplay from "@/app_components/chat/ChatMessage.tsx";
import {Status} from "@/data/types.ts";
import {toast} from "sonner";
import {base64StringToFile, getCurrentTime} from "@/utils.ts";
import {usePostMessage} from "@/data/client/image.tsx";

const ChatUI: React.FC = () => {
  const postMessage = usePostMessage();
  const divRef = useRef(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [roasts]); // This effect runs once after the component mounts

  const scrollToBottom = () => {
    if (divRef.current) {
      // divRef.current.scrollTop = divRef.current.scrollHeight;
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
      <div className="flex flex-col p-4 h-screen min-w-[50%] max-w-[750px] gap-y-4">
        <div className="flex flex-col flex-grow gap-y-6 overflow-y-auto bg-red-400" ref={divRef}>
          { roasts.map((roast, idx ) => (<RoastDisplay {...roast} key={idx} />)) }
        </div>
        <div className="flex w-full">
          <ChatTextArea />
        </div>
      </div>
  );
};

export default ChatUI;