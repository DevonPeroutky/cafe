// MyContext.js
import React from 'react';
import Webcam from "react-webcam";

interface WebcamContextProps {
  webcamRef: React.RefObject<Webcam> | null;
}

const AppContext = React.createContext<WebcamContextProps>({ webcamRef: null });

export default AppContext;


