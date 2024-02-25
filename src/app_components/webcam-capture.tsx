import Webcam from "react-webcam";
import React, {useContext} from "react";
import AppContext from "@/context.ts";

const videoConstraints = {
  width: 1280, height: 720, facingMode: "user"
};

export const WebcamCapture = () => {
  const {webcamRef} = useContext(AppContext);

  return (
    <div className="w-36 h-36 rounded-full absolute bottom-4 right-4 overflow-hidden">
      <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          forceScreenshotSourceSize
          style={{
            maxWidth: "none",
          }}
          className="h-full transform -translate-x-1/4"
      />
    </div>
  )
};
