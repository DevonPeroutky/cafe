import {useRecoilState} from "recoil";
import {imageState} from "../data/local-state/images";
import Webcam from "react-webcam";
import React, {useEffect, useState} from "react";
import {Roast, Status} from "../data/types";
import {CameraIcon} from "@heroicons/react/24/solid";
import {ArrowUpTrayIcon} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {Loader2, MonitorUp} from "lucide-react";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export const WebcamCapture = () => {
  const [disabled, setDisabled] = useState(false);
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pending = roasts.find(r => r.status === Status.Pending)
    setDisabled(pending !== undefined)

  }, [roasts])

  return (
      <div className="relative flex-1 h-full bg-black">
        <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="h-full w-full object-cover"
        >
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          { /* @ts-expect-error */}
          {({getScreenshot}) => (
              // Center div horizontally and vertically
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-x-4 flex">
                <Button
                    disabled={disabled}
                    onClick={() => {
                      const imageSrc = getScreenshot()
                      console.log("Got screenshot: ", imageSrc);

                      if (imageSrc) {
                        setRoasts(currVal => (
                                [...currVal, {imageSrc: imageSrc, status: Status.Pending} as Roast]
                            )
                        );
                      }
                    }}
                >
                  { disabled ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CameraIcon className="mr-2 h-4 w-4"/> } Capture photo
                </Button>
                <Button disabled={disabled}>
                  <MonitorUp className="mr-2 h-4 w-4"/> Upload Photo
                </Button>
              </div>
          )}
        </Webcam>
      </div>
  )
};
