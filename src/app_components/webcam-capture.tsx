import {useRecoilState} from "recoil";
import {imageState} from "../data/local-state/images";
import Webcam from "react-webcam";
import React, {useEffect, useState} from "react";
import {Roast, Status} from "../data/types";
import {CameraIcon} from "@heroicons/react/24/solid";
import {ArrowUpTrayIcon} from "@heroicons/react/24/outline";

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
          { /* @ts-ignore */}
          {({getScreenshot}) => (
              // Center div horizontally and vertically
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-x-4 flex">
                <button
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
                  <div className="flex items-center justify-between gap-x-2">
                    <CameraIcon className="h-6 w-6"/>
                    <span>Capture photo</span>
                  </div>
                </button>
                <button>
                  <div className="flex items-center justify-between gap-x-2 ">
                    <ArrowUpTrayIcon className="h-6 w-6"/>
                    <span>Upload photo</span>
                  </div>
                </button>
              </div>
          )}
        </Webcam>
      </div>
  )
};
