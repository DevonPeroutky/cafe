import { InfoIcon, SettingsIcon} from "lucide-react";
import React from "react";
import {PhotoIcon} from "@heroicons/react/24/outline";

export const Placeholder = () => {
  return (
      <section className="flex flex-col flex-grow py-8">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Sup Douchebag</h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-24 dark:text-gray-400">Most communication is non-verbal. So how good can A.I. therapy be if LLMs can't see you?<br/><br/> I'm not like other models... I see you and take in your visual cues to make the response more "human" and tailored to you.</p>
        </div>
        <div className="flex justify-center mx-auto text-center">
          <div className="text-center list-none p-0 flex flex-col gap-y-3">
            <div className="flex items-center gap-4">
              <PhotoIcon className="h-6 w-6"/><span>Upload an image from your computer to roast</span>
            </div>
            <div className="flex items-center gap-4">
              <SettingsIcon className="h-6 w-6"/> Change my settings (can't do that with a real therapist)
            </div>
          </div>
        </div>
      </section>

  )
}