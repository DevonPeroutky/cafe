import React, {useEffect, useRef} from 'react';
import {useRecoilState} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import RoastDisplay from "@/app_components/chat/ChatMessage.tsx";
import {Placeholder} from "@/app_components/chat/Placeholder.tsx";

const ChatMessageList: React.FC = () => {
  const divRef = useRef(null);
  const [roasts, setRoasts] = useRecoilState(imageState);

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

  if (roasts.length === 0) {
    return <Placeholder />
  }

  return (
    <div className="flex flex-col flex-grow gap-y-6 overflow-y-auto" ref={divRef}>
      { roasts.map((roast, idx ) => (<RoastDisplay {...roast} key={idx} />)) }
    </div>
  );
};

export default ChatMessageList