import {CameraIcon, MonitorUp, RefreshCw} from "lucide-react";
import React from "react";

export const Placeholder = () => {
    return (
        <div className="flex flex-col w-full h-full items-center gap-y-8 transform translate-y-1/4">
          <div>
            <h1 className="text-4xl text-center py-2">Sup douchebag</h1>
            <h3 className="text-lg text-gray-400 text-center">Want to roast someone or yourself, but ChatGPT doesn't have the balls?</h3>
          </div>
          <div className="flex justify-center">
            <div className="text-left list-none p-0 flex flex-col gap-y-3">
              <div className="flex items-center gap-4">
                <MonitorUp className="h-6 w-6"/><span>Upload an image from your computer to roast</span>
              </div>
              <div className="flex items-center gap-4">
                <RefreshCw className="h-6 w-6"/> Re-submit the last image, with the updated parameters, for a new roast
              </div>
              <div className="flex items-center gap-4">
                <CameraIcon className="h-6 w-6"/> Take a photo of yourself from the webcam (required access to the webcam)
              </div>
            </div>
          </div>
        </div>
    )
}