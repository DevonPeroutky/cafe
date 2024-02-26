import {InferenceSettingsForm} from "@/app_components/inference_settings/inference-settings-form.tsx";
import React from "react";

export const Sidebar = () => {
  return (
      <div className="hidden md:h-screen md:flex md:min-w-[275px] md:flex-col md:w-[275px] md:gap-y-4 overflow-y-auto px-4 py-8 border border-[#e5e7eb] border-solid">
        <h1 className="font-medium text-2xl">Inference Settings</h1>
        <InferenceSettingsForm/>
      </div>
  )
}