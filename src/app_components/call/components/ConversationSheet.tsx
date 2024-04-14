import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.tsx";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button.tsx";
import {ChatBubbleBottomCenterIcon} from "@heroicons/react/24/outline";
import ChatMessageList from "@/app_components/chat/ChatMessageList.tsx";

export const ConversationSheet = () => {

  useEffect(() => {
    // Load conversation transcript

  }, []);

  return (
      <Sheet>
        <SheetTrigger>
          <Button className="rounded-full p-3 w-12 h-12 border-soid border-gray-600" variant="outline">
            <ChatBubbleBottomCenterIcon className="h-5 w-5 cursor-pointer"/>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Conversation Transcript</SheetTitle>
            <SheetDescription>
              <ChatMessageList/>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
  )
}
