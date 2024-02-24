import {useRecoilState, useRecoilValue} from "recoil";
import {imageState, lastRoastState} from "../data/local-state/images";
import Webcam from "react-webcam";
import React, {useContext, useEffect, useState} from "react";
import {Roast, Status} from "../data/types";
import {CameraIcon} from "@heroicons/react/24/solid";
import {Button} from "@/components/ui/button";
import {Loader2, MonitorUp, RefreshCw, SlidersHorizontal} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {inferenceArgsState} from "@/data/local-state/inference-args.tsx";
import {useUploadImage} from "@/data/client/image.tsx";
import {binaryFileToBase64String} from "@/utils.ts";
import AppContext from "@/context.ts";

const videoConstraints = {
  width: 1280, height: 720, facingMode: "user"
};

export const WebcamCapture = () => {
  const {webcamRef} = useContext(AppContext);

  const capture = React.useCallback(
      () => {
        if (webcamRef && webcamRef.current) {
          return (webcamRef.current as Webcam).getScreenshot();
        }
      },
      [webcamRef]
  );

  const [disabled, setDisabled] = useState(false);
  const [roasts, setRoasts] = useRecoilState(imageState);
  const mostRecentRoast = useRecoilValue(lastRoastState)
  const [inferenceArgs, setInferenceArgs] = useRecoilState(inferenceArgsState);
  const uploadImage = useUploadImage();

  useEffect(() => {
    const pending = roasts.find(r => r.status === Status.Pending)
    setDisabled(pending !== undefined)

  }, [roasts])

  return (<div className="col-span-2 relative flex-1 h-full bg-black">
    <Button
        disabled={disabled}
        onClick={() => {
          const imageSrc = capture()
          console.log("Got screenshot: ", imageSrc);

          if (imageSrc) {
            setRoasts(currVal => ([...currVal, {
              full_prompt: null,
              basic_roast: null,
              augmented_roast: null, ...inferenceArgs,
              imageSrc: imageSrc,
              status: Status.Pending,
            } as Roast]));
          }
        }}
    >
      {disabled ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
          <CameraIcon className="mr-2 h-4 w-4"/>} Capture photo
    </Button>
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      className="h-full w-full object-cover"
    />
  </div>)
};
