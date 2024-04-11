import React from 'react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {MicrophoneIcon, StopIcon} from "@heroicons/react/24/outline";
import {useAudioRecorder} from "@/app_components/record-audio/useAudioRecorder.tsx";

const MicrophoneRecorder = ({ onRecordingComplete }: { onRecordingComplete: (audioFile: File) => void }) => {
  const { isRecording, toggleRecording } = useAudioRecorder(onRecordingComplete);

  return (
      <div className="audio-recorder">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button onClick={toggleRecording} className={`record-btn ${isRecording ? 'recording' : ''}`}>
                {isRecording ? (
                    <StopIcon className="h-5 w-5 mt-1 text-red-500"/>
                ) : (
                    <MicrophoneIcon className="h-5 w-5 mt-1 text-gray-500"/>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Recording..." : "Click to record"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
  )
};

export default MicrophoneRecorder;