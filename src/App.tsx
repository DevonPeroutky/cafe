import React, {useEffect} from 'react';
import './App.css';
import {RecoilRoot, useRecoilState,} from 'recoil';

import {imageState} from "./data/local-state/images";
import {WebcamCapture} from "./app_components/webcam-capture";
import {Status} from "./data/types";
import {useUploadImage } from "./data/client/image";
import {base64StringToFile, getCurrentTime} from "@/utils.ts";
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner';
import {ResultDisplay} from "@/app_components/result-display.tsx";
import {inferenceArgsState} from "@/data/local-state/inference-args.tsx";
import {InferenceSettingsForm} from "@/app_components/inference_settings/inference-settings-form.tsx";
import {InferenceSettingsPanel} from "@/app_components/inference_settings/inference_settings_panel.tsx";


function App() {
  return (
    <RecoilRoot>
      <Toaster />
      <div className="grid w-screen grid-cols-1 md:grid-cols-3 min-h-screen">
        <InferenceSettingsPanel />
        <WebcamCapture/>
        {/*<ImageList />*/}
      </div>
    </RecoilRoot>
  );
}

const ImageList = () => {
  const uploadImage = useUploadImage();
  const [roasts, setRoasts] = useRecoilState(imageState);
  const [inferenceArgs, setInferenceArgs] = useRecoilState(inferenceArgsState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)
    console.log("Pending roast: ", pendingRoast)
    if (pendingRoast) {
      toast("Image has been submitted for review", {
        description: getCurrentTime(),
        action: {
          label: "Undo",
          onClick: () => toast("There's no going back"),
        },
      })
      const image = base64StringToFile(pendingRoast.imageSrc)
      uploadImage({
        ...inferenceArgs,
        imageFile: image
      })
    }
  }, [roasts]);

  return (
      <div className="col-span-1 w-full overflow-y-scroll h-screen md:h-screen">
        { roasts.map((roast, idx) => (<ResultDisplay key={idx} {...roast}/>)) }
      </div>
  )
}

export default App;
