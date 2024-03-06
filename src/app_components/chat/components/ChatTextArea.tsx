import {PaperAirplaneIcon, PhotoIcon} from "@heroicons/react/24/outline";
import {useOnSubmit} from "@/app_components/inference_settings/utils.tsx";
import React, {useContext, useState} from "react";
import AppContext from "@/context.ts";
import Webcam from "react-webcam";
import {useRecoilValue} from "recoil";
import {pendingRoastState, streamingRoastState} from "@/data/local-state/images.tsx";
import {SettingsIcon} from "lucide-react";
import {SettingsSheet} from "@/app_components/chat/components/SettingsSheet.tsx";

export const ChatTextArea = () => {
  const submit = useOnSubmit();
  const [prompt, setPrompt] = useState<string | null>(null);

  const pendingRoast = useRecoilValue(pendingRoastState)
  const streamingRoast = useRecoilValue(streamingRoastState)
  const disabled = pendingRoast !== undefined || streamingRoast !== undefined

  const {webcamRef} = useContext(AppContext);

  const capture = React.useCallback(() => {
    if (webcamRef && webcamRef.current) {
      return (webcamRef.current as Webcam).getScreenshot();
    }
  }, [webcamRef]);

  const handleSubmit = () => {
    const imageSrc = capture() as string | undefined
    submit({
      prompt: prompt,
      systemPrompt: "A chat between a human and a clever, witty, racist, sexist artificial intelligence whose job it is to give the meanest insults possible. The assistant gives funny racist and witty sexists response to the human's questions.",
      loraName: "13000-4-epochs",
      imageSrc: imageSrc,
      topP: 0.5,
      temperature: 0.7,
      maxNewTokens: 512,
    })
  }

  return (
    <div className="w-full">
      <label htmlFor="chat" className="sr-only text-left">Your message</label>
      <div className="flex items-center px-3 rounded-2xl border border-solid gap-x-2">
        <button type="button"
                className="inline-flex justify-center text-gray-500 rounded-lg cursor-pointer outline-0">
          <SettingsIcon className="w-5 h-5"/>
        </button>
        <SettingsSheet />
        <button type="button"
                className="inline-flex justify-center text-gray-500 rounded-lg cursor-pointer outline-0">
          <PhotoIcon className="w-5 h-5"/>
        </button>
        <textarea
            id="chat"
            rows="1"
            className="outline-0 m-0 w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-[25dvh] max-h-52 placeholder-black/50 dark:placeholder-white/50 pl-2"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (!e.shiftKey && e.key === 'Enter') {
                e.preventDefault()
                console.log('Enter pressed');
                handleSubmit()
                setPrompt('')

              }
            }}
            placeholder="Your message..."/>
        <button
            disabled={disabled}
            onClick={handleSubmit}
            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 outline-0"
        >
          <PaperAirplaneIcon className={`w-5 h-5`}/>
        </button>
      </div>
    </div>
  )
}