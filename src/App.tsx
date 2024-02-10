import React, {useEffect} from 'react';
import './App.css';
import {RecoilRoot, useRecoilState,} from 'recoil';

import {imageState} from "./data/local-state/images";
import {WebcamCapture} from "./app_components/webcam-capture";
import {Roast, Status} from "./data/types";
import {useUploadImage} from "./data/client/image";

const ImageDisplay = (props: Roast) => {
  console.log(props);
  const { imageSrc } = props;
  if (!imageSrc) {
    return null;
  }
  return (
      <div className="flex items-center">
        <img src={imageSrc} alt="photo"/>
        <ImageStateDisplay {...props} />
      </div>
  );
}

const ImageStateDisplay = (roast: Roast) => {
  if (roast.status === Status.Pending) {
    return <div>Hold on asshole...</div>
  }
  return <div>{roast.roast}</div>
}

function App() {
  return (
      <RecoilRoot>
        {/*<Toaster />*/}
        <div className="App">
          {/*<Tabs />*/}
          <WebcamCapture/>
          <br/>
        </div>
        <ImageList />
      </RecoilRoot>
  );
}

const ImageList = () => {
  const uploadImage = useUploadImage()
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)
    if (pendingRoast) {

      // toast("Image has been submitted for review", {
      //   description: getCurrentTime(),
      //   action: {
      //     label: "Undo",
      //     onClick: () => toast("There's no going back"),
      //   },
      // })
      uploadImage(pendingRoast.imageSrc)
    }
  }, [roasts]);

  return (
      <div>
        { roasts.map((roast, idx) => (<ImageDisplay key={idx} {...roast}/>)) }
      </div>
  )
}

export default App;
