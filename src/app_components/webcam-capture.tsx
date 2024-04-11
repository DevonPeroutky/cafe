import Webcam from "react-webcam";
import React, {useContext} from "react";
import AppContext from "@/context.ts";

const videoConstraints = {
  width: 1280, height: 720, facingMode: "user"
};

export const WebcamCapture: React.FC<{ className?: string | undefined }>  = ({ className }) => {
  const {webcamRef} = useContext(AppContext);

  return (
      <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          forceScreenshotSourceSize
          style={{
            maxWidth: "none",
          }}
          className={className}
      />
  )
};
