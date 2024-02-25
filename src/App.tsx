import React, {useEffect} from 'react';
import './App.css';
import {useRecoilState} from 'recoil';

import {imageState} from "./data/local-state/images";
import {WebcamCapture} from "./app_components/webcam-capture";
import {useUploadImage } from "./data/client/image";
import {ResultDisplay} from "@/app_components/result-display.tsx";
import {Sidebar} from "@/app_components/inference_settings/sidebar.tsx";
import {base64StringToFile, getCurrentTime} from "@/utils.ts";
import {toast} from "sonner";
import {Status} from "@/data/types.ts";
import {useLoras} from "@/data/client/loras.tsx";


function App() {
  const fetchLoras = useLoras()

  useEffect(() => {
    fetchLoras()
  }, []);

  return (
    <div className="flex m-0 w-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col h-screen">
        <ImageList />
      </div>
      <WebcamCapture/>
    </div>
  );
}

const ImageList = () => {
  const uploadImage = useUploadImage();
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)

    console.log("Roasts", roasts)

    if (pendingRoast) {
      console.log("Pending roast: ", pendingRoast)
      toast("Image has been submitted for review", {
        description: getCurrentTime(),
        action: {
          label: "Undo",
          onClick: () => toast("There's no going back"),
        },
      })
      const image = base64StringToFile(pendingRoast.imageSrc)

      uploadImage({
        prompt: pendingRoast.prompt,
        systemPrompt: pendingRoast.systemPrompt,
        topP: pendingRoast.topP,
        temperature: pendingRoast.temperature,
        maxNewTokens: pendingRoast.maxNewTokens,
        imageFile: image,
        lora: pendingRoast.lora
      })
    }
  }, [roasts]);

  return (
      <div className="w-full overflow-y-scroll flex flex-col">
        { roasts.map((roast, idx) => (<ResultDisplay key={idx} {...roast}/>)) }
      </div>
  )
}

export default App;
