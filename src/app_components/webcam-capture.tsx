import {useRecoilState} from "recoil";
import {imageState} from "../data/local-state/images";
import Webcam from "react-webcam";
import React, {useEffect, useState} from "react";
import {Roast, Status} from "../data/types";

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
      <div>
        <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-full w-36 h-36 object-cover absolute left-4 bottom-4"
        >
          { /* @ts-ignore */}
          {({getScreenshot}) => (
              <button
                  disabled={disabled}
                  onClick={() => {
                    const imageSrc = getScreenshot()
                    console.log("Got screenshot: ", imageSrc);

                    if (imageSrc) {
                      setRoasts(currVal => (
                              [...currVal, { imageSrc: imageSrc, status: Status.Pending} as Roast]
                          )
                      );
                    }
                  }}
              >
                Capture photo
              </button>
          )}
        </Webcam>
        <br/>
      </div>
  )
};
