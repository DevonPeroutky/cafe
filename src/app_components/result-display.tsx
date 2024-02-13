import {Roast, Status} from "@/data/types.ts";
import React from "react";


const ImageStateDisplay = (roast: Roast) => {
  if (roast.status === Status.Pending) {
    return (
        <div className="flex items-center py-6 px-8 bg-red-500">
          Hold on asshole...
        </div>
    );
  }

  return (
    <div className="flex flex-col py-6 px-8 gap-y-4">
      <div>
        <h1 className="font-medium text-lg">Basic</h1>
        <p>{roast.basic_roast}</p>
      </div>
      <div className=''>
        <h1 className="font-medium text-lg">Augmented</h1>
        <p>{roast.augmented_roast}</p>
      </div>
    </div>
  );
}
export const ResultDisplay = (props: Roast) => {
    return (
        <div className="flex flex-col min-h-24">
          <ImageThumbnail {...props} />
          <ImageStateDisplay {...props} />
        </div>
    );
}

const ImageThumbnail = (props: Roast) => {
  const { imageSrc } = props;
  if (!imageSrc) {
    return null;
  }
  return (
      <div className="flex items-center w-full bg-slate-100 py-6 px-8">
        <img src={imageSrc} alt="photo" className="rounded-2xl w-1/2"/>
      </div>
  );
}