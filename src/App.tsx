import React, {useEffect} from 'react';
import './App.css';
import {RecoilRoot, useRecoilState,} from 'recoil';

import {imageState} from "./data/local-state/images";
import {WebcamCapture} from "./app_components/webcam-capture";
import {Roast, Status} from "./data/types";
import {useUploadImage} from "./data/client/image";
import {getCurrentTime} from "@/utils.ts";
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner';
import {ResultDisplay} from "@/app_components/result-display.tsx";


function App() {
  return (
      <RecoilRoot>
        <Toaster />
        <div className="flex h-screen w-screen">
          <WebcamCapture/>
          <ImageList />
        </div>
      </RecoilRoot>
  );
}

const ImageList = () => {
  const uploadImage = useUploadImage()
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)
    if (pendingRoast) {
      toast("Image has been submitted for review", {
        description: getCurrentTime(),
        action: {
          label: "Undo",
          onClick: () => toast("There's no going back"),
        },
      })
      uploadImage(pendingRoast.imageSrc)
    }
  }, [roasts]);

  return (
      <div className="w-1/3 h-full flex flex-col gap-y-2">
        { roasts.map((roast, idx) => (<ResultDisplay key={idx} {...roast}/>)) }
      </div>
  )
}

export default App;
