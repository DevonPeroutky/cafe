
export const base64StringToFile = (imageSrc: string, fileName = 'image.jpg', mimeType = 'image/jpeg'): File => {
  // Remove data URI prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = imageSrc.split(',')[1];

  // Decode the base64 string into binary data
  const binaryData = atob(base64Data);

  // Create a Blob object from binary data
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: mimeType });

  // Create a File object from the Blob
  const file = new File([blob], fileName, { type: mimeType });

  return file;
}

export const getCurrentTime = () => {
  // Get current date and time
  const now = new Date();

  // Define days of the week and months
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get day, month, year, hours, and minutes
  const dayOfWeek = daysOfWeek[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours() % 12 || 12; // Convert 24-hour format to 12-hour format
  const minutes = now.getMinutes();
  const ampm = now.getHours() < 12 ? 'AM' : 'PM';

  // Return the formatted output
  return `${dayOfWeek}, ${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
}