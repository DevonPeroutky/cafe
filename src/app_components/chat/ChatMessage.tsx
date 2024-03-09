// ChatMessage.tsx
import React from 'react';
import {Roast, Status} from "@/data/types.ts";
import {Loader2} from "lucide-react";

interface ChatMessageProps {
  message: string | undefined | null;
  imageSrc?: string;
  isUser: boolean;
  isLoading: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, imageSrc, isUser , isLoading }) => {
  // get the current time
  const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  });

  const userIcon = isUser ? "/user-icon.svg" : "/ai-icon.svg";

  return (
      <div className="flex items-start gap-2.5 w-full">
        <img className="w-6 h-6 rounded-full" src={userIcon} alt="Jese image"/>
        <div className="flex flex-col w-full leading-1.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="pb-1 text-md font-semibold text-gray-900 dark:text-white">{isUser ? "You" : `Dr. Beau Nerr`}</span>
            {/*<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{time}</span>*/}
          </div>
          { imageSrc ?
              <div className="flex justify-start w-full gap-y-2 gap-x-2 pb-2">
                <img src={imageSrc} alt="photo" className="rounded-2xl w-1/2"/>
              </div> : null
          }
          {isLoading ?
              <p className="flex italic items-center text-sm font-normal text-gray-400 dark:text-white">
                <Loader2 className="h-4 w-4 mr-2 animate-spin"/> Hold on asshole...
              </p> :
              <p className="text-sm font-normal text-gray-900 dark:text-white">{message}</p>
          }
        </div>
      </div>
  );
};


const RoastDisplay: React.FC<Roast> = ({augmentedRoast, prompt, status, imageSrc , displayImage}) => {

  return (
      <>
        <ChatMessage message={prompt} imageSrc={displayImage ? imageSrc : undefined} isUser={true} isLoading={false} />
        <ChatMessage message={augmentedRoast} isUser={false} isLoading={status === Status.Pending}/>
      </>
  )
}

export default RoastDisplay;