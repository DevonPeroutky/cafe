import {useEffect, useRef, useState} from "react";

export const useAudioRecorder = (onRecordingComplete: (audioFile: File) => void) => {

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

  return { isRecording, toggleRecording };

}


export const startRecording = async () => {
  console.log("LISTENING!!!!!!!")
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    // Create an AudioContext and connect the microphone stream to a processor
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    // Create a processor to analyze the audio input
    const processor = audioContext.createScriptProcessor(512, 1, 1);

    // Connect the processor
    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      let sum = 0;
      for (let i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
      }
      let volume = Math.sqrt(sum / input.length);
      if (volume > 0.1) { // Threshold value, adjust based on testing
        console.log('Voice detected');
        // Implement actions to take on voice detection
      }
    };
  } catch (error) {
    console.error('Error accessing the microphone', error);
  }
}

startRecording();