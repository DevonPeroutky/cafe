import React, {useEffect, useRef} from 'react';
import {useRecoilState} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import RoastDisplay from "@/app_components/chat/ChatMessage.tsx";
import {EmptyPlaceholder, Placeholder} from "@/app_components/chat/Placeholder.tsx";

const ChatMessageList: React.FC = () => {
  const divRef = useRef(null);
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    scrollToBottom();
  }, [roasts]); // This effect runs once after the component mounts

  const scrollToBottom = () => {
    if (divRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      divRef.current.scrollTo({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        top: divRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  console.log("ROASTS: ", roasts)

  if (roasts.length === 0) {
    return <EmptyPlaceholder />
  }

  return (
    <div className="flex flex-col flex-grow gap-y-6 overflow-y-auto" ref={divRef}>
      { roasts.map((roast, idx ) => (<RoastDisplay {...roast} key={idx} />)) }
    </div>
  );
};

export default ChatMessageList