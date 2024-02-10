import {base64StringToFile} from "../../utils";
import {Status} from "../types";
import {useRecoilState} from "recoil";
import {imageState} from "../local-state/images";


export const useUploadImage = () => {
  const [roasts, setRoasts] = useRecoilState(imageState);

  return async (imageSrc: string, filename =  'image.jpeg', mimeType = 'image/jpeg') => {
    const uploadFile = base64StringToFile(imageSrc, filename, mimeType)
    console.log(roasts)

    if (imageSrc) {
      console.log(imageSrc)
      const formData = new FormData();
      formData.append('file', uploadFile);

      try {
        const response = await fetch('http://127.0.0.1:8000/uploadfile/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Server response:', data);

          // filter out the roast that is in the pending state
          const existingRoasts = roasts.slice(0, -1);

          // Create a new array containing only the last element
          const pendingRoast = roasts[roasts.length - 1];

          if (pendingRoast.status !== Status.Pending) {
            const message = "Roast is in state " + pendingRoast.status + "expected PENDING"
            console.error('Assertion failed:', message);
            throw new Error(message || 'Assertion failed');
          }

          setRoasts([...existingRoasts, {...pendingRoast, status: Status.Success, roast: data.roast_response }])

          return data
        } else {
          console.error('Server error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No file selected');
    }
  }
}