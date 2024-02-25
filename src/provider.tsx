import React, {useRef} from 'react';
import WebcamContext from './context.ts';
import Webcam from "react-webcam";

const WebcamProvider = ({ children }) => {
  // const [webcamRef, setWebcamRef] = useState(null);
  const webcamRef = useRef<Webcam>(null);

  // const setRef = (ref) => {
  //   setWebcamRef(ref);
  // };

  return (
      <WebcamContext.Provider value={{ webcamRef }}>
        {children}
      </WebcamContext.Provider>
  );
};

export default WebcamProvider;