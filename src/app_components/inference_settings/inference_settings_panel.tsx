import {InferenceSettingsForm} from "@/app_components/inference_settings/inference-settings-form.tsx";

export const InferenceSettingsPanel = () => {
  return (
      <div className="flex flex-col px-8 py-6 gap-y-4">
        <h1 className="font-medium text-2xl">Inference Settings</h1>
        <InferenceSettingsForm/>
      </div>
  )

}