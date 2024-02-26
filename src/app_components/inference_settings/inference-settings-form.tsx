import {Input} from "@/components/ui/input.tsx";
import {Status} from "@/data/types.ts";
import {CameraIcon, Loader2, MonitorUp, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import React, {useContext, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {imageState, pendingRoastState} from "@/data/local-state/images.tsx";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx"
import {Textarea} from "@/components/ui/textarea.tsx"
import {useFormContext} from "react-hook-form";
import AppContext from "@/context.ts";
import Webcam from "react-webcam";
import {LoraSelect} from "@/app_components/lora-select.tsx";
import {Label} from "@/components/ui/label.tsx";
import {binaryFileToBase64String} from "@/utils.ts";
import {useOnSubmit} from "@/app_components/inference_settings/utils.tsx";


export const InferenceSettingsForm = () => {
  const submit = useOnSubmit();
  const { setValue, handleSubmit , control, formState} = useFormContext()

  const [roasts, setRoasts] = useRecoilState(imageState);
  const pendingRoast = useRecoilValue(pendingRoastState)
  const disabled = pendingRoast !== undefined

  const {webcamRef} = useContext(AppContext);

  const capture = React.useCallback(() => {
    if (webcamRef && webcamRef.current) {
      return (webcamRef.current as Webcam).getScreenshot();
    }
  }, [webcamRef]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit(submit)}>
    <div className="space-y-6">
      <FormField
        name="maxNewTokens"
        control={control}
        render={({field}) => <FormItem>
                                <FormLabel>Max New Tokens</FormLabel>
                                <FormControl>
                                <Input
                                type="number"
                                placeholder="Max New Tokens"
                                className="resize-none"
                                {...field}
                                />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>}
      />
      <FormField
          name="topP"
          control={control}
          render={({field}) => <FormItem>
                                  <FormLabel>Top P</FormLabel>
                                  <FormControl>
                                  <Input
                                  placeholder="Top P"
                                  className="resize-none"
                                  {...field}
                                  />
                                  </FormControl>
                                  <FormMessage/>
                                  </FormItem>}
      />
      <FormField
          name="temperature"
          control={control}
          render={({field}) => <FormItem>
                                  <FormLabel>Temperature</FormLabel>
                                  <FormControl>
                                  <Input
                                  placeholder="Temperature"
                                  className="resize-none"
                                  {...field}
                                  />
                                  </FormControl>
                                  <FormMessage/>
                                  </FormItem>
          }
      />
      <LoraSelect />
      <FormField
          name="systemPrompt"
          control={control}
          render={({field}) => <FormItem>
                                  <FormLabel>System Prompt</FormLabel>
                                  <FormControl>
                                  <Textarea
                                  rows={8}
                                  placeholder="The system prompt"
                                  className="resize-none"
                                  {...field}
                                  />
                                  </FormControl>
                                  <FormDescription>
                                  Informs the A.I. how to behave
                                  </FormDescription>
                                  <FormMessage/>
                                  </FormItem>}
      />
      <FormField
          name="prompt"
          control={control}
          render={({field}) => <FormItem>
                                  <FormLabel>Prompt</FormLabel>
                                  <FormControl>
                                  <Textarea
                                  placeholder="The instruction specific prompt"
                                  className="resize-none"
                                  {...field}
                                  />
                                  </FormControl>
                                  <FormDescription>
                                  Tell the A.I. what you want
                                  </FormDescription>
                                  <FormMessage/>
                                  </FormItem>}
      />
    </div>
    <div className="flex gap-x-2 w-full justify-center">
      <Label>
        <Input accept=".webp,.jpg,.jpeg,.png" disabled={disabled} type="file" className="hidden" onChange={e => {
          const fileInput = e.target;
          const files = fileInput.files;
          const image = files![0]

          binaryFileToBase64String(image).then((imageSrc) => {
            setValue("imageSrc", imageSrc);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            handleSubmit(submit)(e)
          })
        }}/>
        <div className={`cursor-pointer h-10 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ${disabled ? "opacity-50" : ""}`}>
          {disabled ? <Loader2 className="h-4 w-4 animate-spin"/> : <MonitorUp className="h-4 w-4"/>}
        </div>
      </Label>
      <Button
          size="icon"
          disabled={disabled || !formState.isValid || roasts.length == 0}
      >
        {disabled ? <Loader2 className="h-4 w-4 animate-spin"/> : <RefreshCw className="h-4 w-4"/>}
      </Button>
      <Button
          disabled={disabled || !formState.isValid}
          size="icon"
          onClick={(e) => {
            const imageSrc = capture() as string | undefined
            setValue("imageSrc", imageSrc)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            handleSubmit(submit)(e)
          }}
      >
        {disabled ? <Loader2 className="h-4 w-4 animate-spin"/> : <CameraIcon className="h-4 w-4"/>}
      </Button>
    </div>
  </form>
}