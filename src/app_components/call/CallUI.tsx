import React, {useEffect, useRef} from "react";
import {WebcamCapture} from "@/app_components/webcam-capture.tsx";
import MicrophoneRecorder from "@/app_components/record-audio/MicrophoneRecorder.tsx";
import {transcribeAudio} from "@/data/client/audio.ts";

export const PhotoSquare = ({ photoUrl }) => {
  return <img src={photoUrl} alt="Participant" className="w-full h-full object-cover" />;
};

export const VideoSquare = ({ fallbackPhotoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // handle error, e.g., user denied webcam access
        });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
      <video ref={videoRef} autoPlay className="w-full h-full object-cover"/>
  )
};

export const CallUI = () => {
  return (
      <div className="min-h-screen w-screen flex flex-col gap-y-16 items-center justify-center bg-white dark:bg-gray-900">
        <div className="grid grid-cols-2 gap-x-8 w-full h-full px-4 max-w-[1000px]">
          <div className="border-solid border border-gray-600 aspect-square rounded-full overflow-hidden">
            <PhotoSquare photoUrl="/dr-phil.jpeg" />
          </div>
          <div className="flex items-center aspect-square rounded-full border-solid border-red-900 border overflow-hidden">
              <WebcamCapture className="w-full h-full object-cover"/>
          </div>
        </div>
        <div className="text-gray-600">Enable the microphone and just start talking</div>
      </div>
  )
}