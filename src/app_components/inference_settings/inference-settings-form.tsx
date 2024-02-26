import {Input} from "@/components/ui/input.tsx";
import {Roast, Status} from "@/data/types.ts";
import {CameraIcon, Loader2, MonitorUp, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import React, {useContext, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {imageState} from "@/data/local-state/images.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx"
import {Textarea} from "@/components/ui/textarea.tsx"
import {useForm, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormSchema} from "@/app_components/inference_settings/schema.tsx";
import AppContext from "@/context.ts";
import Webcam from "react-webcam";
import {LoraSelect} from "@/app_components/lora-select.tsx";
import {lorasState} from "@/data/local-state/loras.tsx";
import {Label} from "@/components/ui/label.tsx";
import {binaryFileToBase64String} from "@/utils.ts";


export const InferenceSettingsForm = () => {
  const [disabled, setDisabled] = useState(false);
  const [roasts, setRoasts] = useRecoilState(imageState);
  const loras = useRecoilValue(lorasState);

  const {webcamRef} = useContext(AppContext);

  const capture = React.useCallback(() => {
    if (webcamRef && webcamRef.current) {
      return (webcamRef.current as Webcam).getScreenshot();
    }
  }, [webcamRef]);

  const form = useForm<z.infer<typeof FormSchema>>({
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const lora = loras.find(l => l.displayName === data.loraName)

    // Resubmit the image with the new inference settings
    setRoasts(currVal => ([...currVal, {
      prompt: data.prompt,
      lora: lora,
      systemPrompt: data.systemPrompt,
      fullPrompt: null,
      basicRoast: null,
      augmentedRoast: null,
      imageSrc: data.imageSrc,
      topP: data.topP,
      temperature: data.temperature,
      maxNewTokens: data.maxNewTokens,
      status: Status.Pending,
    } as Roast]));
  }

  useEffect(() => {
    const pending = roasts.find(r => r.status === Status.Pending)
    setDisabled(pending !== undefined)

  }, [roasts])

  console.log(form.formState.isValid)
  console.log(form.getValues())

  return (
    <Form {...form}>
      <form className="flex flex-col justify-between h-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            name="maxNewTokens"
            control={form.control}
            render={({field}) => (<FormItem>
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
                                    </FormItem>)}
          />
          <FormField
              name="topP"
              control={form.control}
              render={({field}) => (<FormItem>
                                      <FormLabel>Top P</FormLabel>
                                      <FormControl>
                                      <Input
                                      placeholder="Top P"
                                      className="resize-none"
                                      {...field}
                                      />
                                      </FormControl>
                                      <FormMessage/>
                                      </FormItem>)}
          />
          <FormField
              name="temperature"
              control={form.control}
              render={({field}) => (
                                      <FormItem>
                                      <FormLabel>Temperature</FormLabel>
                                      <FormControl>
                                      <Input
                                      placeholder="Temperature"
                                      className="resize-none"
                                      {...field}
                                      />
                                      </FormControl>
                                      <FormMessage/>
                                      </FormItem>)
              }
          />
          <LoraSelect form={form}/>
          <FormField
              name="systemPrompt"
              control={form.control}
              render={({field}) => (<FormItem>
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
                                      </FormItem>)}
          />
          <FormField
              name="prompt"
              control={form.control}
              render={({field}) => (<FormItem>
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
                                      </FormItem>)}
          />
        </div>
        <div className="flex gap-x-2 w-full justify-center">
          <Label>
            <Input accept=".webp,.jpg,.jpeg,.png" disabled={disabled} type="file" className="hidden" onChange={e => {
              const fileInput = e.target;
              const files = fileInput.files;
              const image = files![0]

              binaryFileToBase64String(image).then((imageSrc) => {
                form.setValue("imageSrc", imageSrc);
                form.handleSubmit(onSubmit)(undefined)
              })
            }}/>
            <div className={`cursor-pointer h-10 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}>
              {disabled ? <Loader2 className="h-4 w-4 animate-spin"/> : <MonitorUp className="h-4 w-4"/>}
            </div>
          </Label>
          <Button
              size="icon"
              disabled={disabled || !form.formState.isValid}
          >
            {disabled ? <Loader2 className="h-4 w-4 animate-spin"/> : <RefreshCw className="h-4 w-4"/>}
          </Button>
          <Button
              disabled={disabled || !form.formState.isValid}
              size="icon"
              onClick={(e) => {
                const imageSrc = capture() as string | undefined
                form.setValue("imageSrc", imageSrc)
                form.handleSubmit(onSubmit)
              }}
          >
            {disabled ? <Loader2 className="h-4 w-4 animate-spin"/> : <CameraIcon className="h-4 w-4"/>}
          </Button>
        </div>
      </form>
    </Form>
  )
}