import React, {useEffect, useRef} from 'react';
import './App.css';
import {useRecoilState} from 'recoil';

import {imageState} from "./data/local-state/images";
import {WebcamCapture} from "./app_components/webcam-capture";
import {useUploadImage } from "./data/client/image";
import {ResultDisplay} from "@/app_components/result-display.tsx";
import {Sidebar} from "@/app_components/inference_settings/sidebar.tsx";
import {base64StringToFile, getCurrentTime} from "@/utils.ts";
import {toast} from "sonner";
import {Status} from "@/data/types.ts";
import {useLoras} from "@/data/client/loras.tsx";
import {FormProvider, useForm} from 'react-hook-form';
import {z} from "zod";
import {FormSchema} from "@/app_components/inference_settings/schema.tsx";
import {zodResolver} from "@hookform/resolvers/zod";


function App() {
  const fetchLoras = useLoras()

  // const methods = useForm()
  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema), defaultValues: {
      prompt: "How would you insult this person?",
      imageSrc: undefined,
      systemPrompt: "A chat between a human and a clever, witty, racist, sexist artificial intelligence whose job it is to give the meanest insults possible. The assistant gives funny racist and witty sexists response to the human's questions.",
      maxNewTokens: 512,
      topP: .8,
      temperature: .2,
      loraName: "Loading",
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    fetchLoras()
  }, []);

  return (
    <div className="flex m-0 w-screen">
      <FormProvider {...methods}>
        <Sidebar />
        <div className="flex flex-col h-screen">
          <ImageList />
        </div>
        <WebcamCapture/>
      </FormProvider>
    </div>
  );
}

const ImageList = () => {
  const uploadImage = useUploadImage();
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)

    if (pendingRoast) {
      toast("Image has been submitted for review", {
        description: getCurrentTime(),
        action: {
          label: "Undo",
          onClick: () => toast("There's no going back"),
        },
      })
      const image = base64StringToFile(pendingRoast.imageSrc)

      uploadImage({
        prompt: pendingRoast.prompt,
        systemPrompt: pendingRoast.systemPrompt,
        topP: pendingRoast.topP,
        temperature: pendingRoast.temperature,
        maxNewTokens: pendingRoast.maxNewTokens,
        imageFile: image,
        lora: pendingRoast.lora
      })
    }
  }, [roasts]);

  return (
      <div className="w-full overflow-y-scroll flex flex-col">
        { roasts.map((roast, idx) => (<ResultDisplay key={idx} {...roast}/>)) }
      </div>
  )
}

export default App;
