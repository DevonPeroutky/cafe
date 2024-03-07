import React, {useEffect} from "react";
import {WebcamCapture} from "@/app_components/webcam-capture.tsx";
import ChatUI from "@/app_components/chat/ChatUI.tsx";
import {useLoras} from "@/data/client/loras.tsx";

export const Therapize = () => {
  const fetchLoras = useLoras()

  useEffect(() => {
    fetchLoras()
  }, []);

  return (
      <>
        <div className="min-h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <ChatUI/>
        </div>
        <WebcamCapture/>
      </>
  );
}