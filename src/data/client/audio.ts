import {API_ENDPOINT} from "@/data/client/constants.ts";

export const transcribeAudio = async (audioFile: File): Promise<void> => {
  console.log(`SENDING AUDIO `, audioFile);
  const formData = new FormData();
  formData.append("audio_file", audioFile);

  try {
    const response = await fetch(`${API_ENDPOINT}/transcribe/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: { transcription: string } = await response.json();
    console.log(data.transcription);
  } catch (error) {
    console.error("Error sending audio:", error);
  }
};

export const audioInputAudioResponse = async (user_id: string, audioFile: File): Promise<void> => {
  console.log(`SENDING AUDIO `, audioFile);
  const formData = new FormData();
  formData.append("audio_file", audioFile);

  fetch(`${API_ENDPOINT}/audio-input-audio-response?user_id=${user_id}`, {
    method: 'POST',
    body: formData,
  })
      .then(response => response.blob())
      .then(audioBlob => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      });
}


export const audioInputStreamAudioResponse = async (user_id: string, audioFile: File): Promise<HTMLAudioElement> => {
  console.log(`SENDING AUDIO `, audioFile);
  const formData = new FormData();
  formData.append("audio_file", audioFile);

  return fetch(`${API_ENDPOINT}/audio-input-stream-audio-response?user_id=${user_id}`, {
    method: 'POST',
    body: formData,
  })
      .then(response => response.blob())
      .then(audioBlob => {
        console.log(`WE GOT A BLOB `, audioBlob)
        const audioUrl = URL.createObjectURL(audioBlob);
        return new Audio(audioUrl);
      });
}
