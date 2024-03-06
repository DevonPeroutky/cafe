import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {SettingsIcon} from "lucide-react";
import React from "react";
import {InferenceSettingsForm} from "@/app_components/inference_settings/inference-settings-form.tsx";

export const SettingsSheet = () => {
  return (
      <Sheet>
        <SheetTrigger>
          <SettingsIcon className="w-5 h-5  text-gray-500 rounded-lg cursor-pointer outline-0"/>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Inference Settings</SheetTitle>
            <SheetDescription>
              Coming soon...
              {/*<InferenceSettingsForm/>*/}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
  )
}