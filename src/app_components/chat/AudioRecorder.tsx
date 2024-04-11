
import React, { useState, useEffect, useRef } from 'react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {MicrophoneIcon, StopIcon} from "@heroicons/react/24/outline";

const AudioRecorder = ({ onRecordingComplete }: { onRecordingComplete: (audioFile: File) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Request microphone access and setup MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

            const audioFile = new File([audioBlob], "audio_filename", {
              type: audioBlob.type, // Preserving the original MIME type
              lastModified: new Date().getTime() // Optionally set the lastModified time to now
            });

            onRecordingComplete(audioFile);
            audioChunksRef.current = [];
          };
        })
        .catch(console.error);

    // Cleanup
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    };
  }, [onRecordingComplete]);

  const startRecording = () => {
    if (mediaRecorderRef.current?.state === 'inactive') {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    console.log("TOGGLE")
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

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

export default AudioRecorder;