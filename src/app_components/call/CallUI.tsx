import React, {useState} from "react";
import {WebcamCapture} from "@/app_components/webcam-capture.tsx";
import {audioInputStreamAudioResponse} from "@/data/client/audio.ts";
import {useMicVAD, utils} from "@ricky0123/vad-react";
import {useRecoilValue} from "recoil";
import {userState} from "@/data/local-state/user.tsx";
import {MicrophoneIcon} from "@heroicons/react/24/outline";
import {MicrophoneIcon as MicroPhoneIconSolid} from "@heroicons/react/24/solid";
import {Button} from "@/components/ui/button"
import {ConversationSheet} from "@/app_components/call/components/ConversationSheet.tsx";


export const CallUI = () => {
  const userId = useRecoilValue(userState);
  const [aiThinking, setAIThinking] = useState(false)
  const [aiSpeaking, setAISpeaking] = useState(false)
  const [userSpeaking, setUserSpeaking] = useState(false)

  const toggleMic = () => {
    if (vad.listening) {
      vad.pause()
    } else {
      vad.start()
    }
  }

  const vad = useMicVAD({
    startOnLoad: false,
    redemptionFrames: 14,
    onSpeechStart: () => {
      setUserSpeaking(true)
      console.log("User started talking")
    },
    onVADMisfire: () => {
      setUserSpeaking(false)
    },
    onSpeechEnd: (audio) => {
      setUserSpeaking(false)

      // Check if ai is currently thinking or speaking
      if (aiThinking || aiSpeaking) {
        return;
      }

      // Submit to AI for response
      setAIThinking(true)

      console.log("User stopped talking")
      const wavBuffer = utils.encodeWAV(audio)

      // Step 2: Create a Blob from the WAV buffer
      const audioBlob = new Blob([wavBuffer], {type: 'audio/wav'});

      // Step 3: Convert Blob to File
      const audioFile = new File([audioBlob], "temp", {type: 'audio/wav', lastModified: Date.now()});

      // transcribeAudio(audioFile)
      audioInputStreamAudioResponse(userId, audioFile)
          .then(audio => {
            setAISpeaking(true);

            audio.addEventListener('ended', () => {
                setAISpeaking(false);
                setAIThinking(false);
            })

            // if HTMLaudioelement is empty, don't play
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (audio.size === 0) {
              setAISpeaking(false);
              return;
            }
            audio.play().then(() => {
              console.log("Audio played")
            });
          });
    },
  })

  let aiOutline = "outline-transparent"
  if (aiThinking) {
    aiOutline = "thinking"
  } else if (aiSpeaking) {
    aiOutline = "talking"
  }

  return (<div
          className="min-h-screen w-screen flex flex-col gap-y-16 items-center justify-center">
        <div className="grid grid-cols-2 gap-x-16 w-full h-full px-4 max-w-[1000px]">
          <div className={`rounded-full ${aiOutline}`}>
            <img src={"/dr-phil.jpeg"} alt="Participant" style={{
              objectFit: `cover`, borderRadius: `50%`, width: `calc(100% - 1px)`, height: `calc(100% - 1px)`,
            }}/>
          </div>
          <div
              className={`flex items-center justify-center aspect-square rounded-full ${userSpeaking ? "talking" : ""}`}>
            <WebcamCapture className="object-cover flex items-center justify-center rounded-full w-[99%] h-[99%]"/>
          </div>
        </div>
        <div className="text-gray-600">Enable the microphone and just start talking</div>
        <div className="flex gap-x-2">
          <ConversationSheet />
          {(vad.listening) ?
              <Button onClick={toggleMic} className="border-solid border-blue-600 border rounded-full p-3 bg-blue-600 hover:bg-blue-400 w-12 h-12">
                <MicroPhoneIconSolid className="w-10 h-10"/>
              </Button> : <Button onClick={toggleMic} className="border-solid border-gray-600 border rounded-full p-3 w-12 h-12" variant="outline">
                <MicrophoneIcon className="h-5 w-5"/>
              </Button>}
        </div>
      </div>)
}