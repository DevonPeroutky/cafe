import Webcam from "react-webcam";
import React, {CSSProperties, useContext} from "react";
import AppContext from "@/context.ts";

const videoConstraints = {
  width: 1280, height: 720, facingMode: "user"
};

export const WebcamCapture: React.FC<{ className?: string | undefined, style?: CSSProperties | undefined }>  = ({ className, style }) => {
  const {webcamRef} = useContext(AppContext);

  const selected_style = style || {maxWidth: "none"}
  return (
      <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          forceScreenshotSourceSize
          style={selected_style}
          className={className}
      />
  )
};
