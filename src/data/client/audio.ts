import {API_ENDPOINT} from "@/data/client/constants.ts";

export const sendAudio = async (audioFile: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", audioFile);

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