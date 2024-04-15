import {ChatMessageT} from "@/app_components/chat/types.ts";
import {EmptyPlaceholder} from "@/app_components/chat/Placeholder.tsx";
import React, {useEffect, useState} from "react";
import {ChatMessage} from "@/app_components/chat/ChatMessage.tsx";
import {useLoadConversation} from "@/data/client/message.tsx";
import {useRecoilValue} from "recoil";
import {userState} from "@/data/local-state/user.tsx";

export const ConversationTranscription = () => {
  const [messages, setMessages] = useState<ChatMessageT[]>([])
  const userId = useRecoilValue(userState);
  const loadConversation = useLoadConversation();


  useEffect(() => {
    console.log("Loading conversation transcript for: ", userId)
    loadConversation(userId).then(setMessages)
  }, [])

  if (!messages || messages.length === 0) {
    return <EmptyPlaceholder />
  }

  return (
      <div className="flex flex-col gap-y-4 py-5">
        {messages.map(({ content, role }, idx) => (
            <ChatMessage key={idx} isLoading={false} isUser={role === 'user'} message={content}/>
        ))}
      </div>
  )
}