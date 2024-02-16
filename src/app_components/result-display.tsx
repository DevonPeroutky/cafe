import {Roast, Status} from "@/data/types.ts";
import React from "react";


const ImageStateDisplay = (roast: Roast) => {
  if (roast.status === Status.Pending) {
    return (
        <div className="flex items-center py-6 px-8">
          Hold on asshole...
        </div>
    );
  }

  return (
    <div className="flex flex-col py-6 px-8 gap-y-4">
      <div>
        <h1 className="font-medium text-md">Basic</h1>
        <p>{roast.basic_roast}</p>
      </div>
      <div className=''>
        <h1 className="font-medium text-md">Augmented</h1>
        <p>{roast.augmented_roast}</p>
      </div>
    </div>
  );
}
export const ResultDisplay = (props: Roast) => {
    return (
        <div className="flex flex-col min-h-24 text-sm">
          <ImageThumbnail {...props} />
          <ImageStateDisplay {...props} />
        </div>
    );
}

const ImageThumbnail = (props: Roast) => {
  const { imageSrc, full_prompt } = props;
  if (!imageSrc) {
    return null;
  }
  return (
      <div className="flex flex-col w-full bg-slate-100 py-6 px-8 gap-y-2">
        <img src={imageSrc} alt="photo" className="rounded-2xl w-1/2"/>
        <p className="pt-4 text-sm">{full_prompt}</p>
        <div className="flex flex-col">
          <span><b>Temperature: </b> {props.topP}</span>
          <span><b>Top P: </b>{props.temperature}</span>
        </div>
      </div>
  );
}