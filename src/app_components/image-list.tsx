import {usePostMessage} from "@/data/client/image.tsx";
import {useRecoilState} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import React, {useEffect} from "react";
import {Status} from "@/data/types.ts";
import {toast} from "sonner";
import {base64StringToFile, getCurrentTime} from "@/utils.ts";
import {Placeholder} from "@/app_components/placeholder.tsx";
import {ResultDisplay} from "@/app_components/result-display.tsx";

export const ImageList = () => {
  const postMessage = usePostMessage();
  const [roasts, setRoasts] = useRecoilState(imageState);

  useEffect(() => {
    const pendingRoast = roasts.find(r => r.status === Status.Pending)
    console.log(`ROASTS: `, roasts)

    if (pendingRoast) {
      toast("Image has been submitted for review", {
        description: getCurrentTime(),
        action: {
          label: "Undo",
          onClick: () => toast("There's no going back"),
        },
      })
      const image = base64StringToFile(pendingRoast.imageSrc)

      postMessage(pendingRoast.id, {
        prompt: pendingRoast.prompt,
        topP: pendingRoast.topP,
        temperature: pendingRoast.temperature,
        maxNewTokens: pendingRoast.maxNewTokens,
        imageFile: image,
        lora: pendingRoast.lora
      })
    }
  }, [roasts]);

  if (roasts.length === 0) {
    return <Placeholder />
  }

  return (
      <div className="w-full overflow-y-scroll flex flex-col">
        { roasts.map((roast, idx) => (<ResultDisplay key={idx} {...roast}/>)) }
      </div>
  )
}
