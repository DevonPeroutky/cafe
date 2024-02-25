import {Roast, Status} from "@/data/types.ts";
import React from "react";
import {Loader2} from "lucide-react";


const ImageStateDisplay = (roast: Roast) => {
  if (roast.status === Status.Pending) {
    return (
        <div className="flex items-center px-8">
          <Loader2 className="h-4 w-4 mr-2 animate-spin"/> Hold on asshole...
        </div>
    );
  }

  if (roast.status === Status.Failed) {
    return (
        <div className="flex items-center px-8 ">
          Server had an error... Looks like you're too ugly to roast.
        </div>
    );
  }

  return (
    <div className="flex flex-col px-8">
      <p>{roast.augmentedRoast}</p>
    </div>
  );
}
export const ResultDisplay = (props: Roast) => {
    return (
        <div className="flex flex-1 w-full flex-col text-sm gap-y-4 py-8 pl-6 pr-28">
          <ImageThumbnail {...props} />
          <ImageStateDisplay {...props} />
        </div>
    );
}

const ImageThumbnail = (props: Roast) => {
  const { imageSrc} = props;
  if (!imageSrc) {
    return null;
  }
  return (
      <div className="flex flex-col w-full px-8 gap-y-2">
        <img src={imageSrc} alt="photo" className="rounded-2xl w-1/2"/>
      </div>
  );
}