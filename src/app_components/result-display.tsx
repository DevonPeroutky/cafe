import {Roast, Status} from "@/data/types.ts";
import React, {useEffect, useState} from "react";
import {Loader2, RefreshCcw, SlidersHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useOnSubmit} from "@/app_components/inference_settings/utils.tsx";
import {useFormContext} from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useRecoilValue} from "recoil";
import {pendingRoastState} from "@/data/local-state/images.tsx";


const ImageStateDisplay = (roast: Roast) => {
  const streamingData = roast.augmentedRoast || '';
  const [displayedText, setDisplayedText] = useState('');
  let index = 0;

  // Effect to implement the typewriter effect
  useEffect(() => {
    const delay = 50;  // Adjust the delay between characters

    if (streamingData === '') {
        return;
    }

    const typewriterInterval = setInterval(() => {
      setDisplayedText(prevText => {
        if (index === streamingData.length) {
          clearInterval(typewriterInterval);
        }
        index += 1;
        return streamingData.substring(0, index);
      });
    }, delay);

    return () => {
      clearInterval(typewriterInterval);
    };
  }, [streamingData]);  // Run this effect whenever streamingData changes

  if (roast.status === Status.Pending) {
    return (
        <div className="flex items-center px-8">
          <Loader2 className="h-4 w-4 mr-2 animate-spin"/> Hold on asshole...
        </div>
    );
  }

  if (roast.status === Status.Failed) {
    return (
        <div className="flex items-center px-8 text-red-400">
          Server had an error... Looks like you're too ugly to roast.
        </div>
    );
  }

  return (
      <div className="flex flex-col px-8">
        {/*<p>{roast.augmentedRoast}</p>*/}
        <p>{displayedText}</p>
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
  const submit = useOnSubmit();
  const { setValue, getValues, formState } = useFormContext()
  const { imageSrc, maxNewTokens, temperature, topP, lora, prompt, systemPrompt} = props;

  const pendingRoast = useRecoilValue(pendingRoastState)
  const disabled = pendingRoast !== undefined

  if (!imageSrc) {
    return null;
  }

  const handleGetFormValues = () => {
    // Update the imageSrc in the form
    setValue("imageSrc", imageSrc)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    submit(getValues())
  };

  return (
      <div className="flex justify-start w-full px-8 gap-y-2 gap-x-2">
        <img src={imageSrc} alt="photo" className="rounded-2xl w-1/2"/>
        <div className="flex gap-x-1">
          <Popover>
            <PopoverTrigger className="flex flex-shrink flex-col h-fit">
              <Button size="icon" className="rounded-full">
                <SlidersHorizontal className="p-1"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Top P</Label>
                    <Input
                        id="width"
                        defaultValue={topP}
                        disabled
                        className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                        id="temperature"
                        disabled
                        defaultValue={temperature}
                        className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxHeight">Max Tokens</Label>
                    <Input
                        id="max_tokens"
                        disabled
                        defaultValue={maxNewTokens}
                        className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="model">Model</Label>
                    <Input
                        id="model"
                        disabled
                        defaultValue={lora?.displayName || "Base Model"}
                        className="col-span-2 h-8"
                    />
                  </div>
                  <div className="flex flex-col gap-4 ">
                    <Label htmlFor="model">System Prompt</Label>
                    <Textarea disabled value={systemPrompt} rows={6}/>
                  </div>
                  <div className="flex flex-col items gap-4">
                    <Label htmlFor="model">Prompt</Label>
                    <Textarea disabled value={prompt}/>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button disabled={disabled || !formState.isValid} size="icon" className="rounded-full" onClick={() => handleGetFormValues()}><RefreshCcw className="p-1"/></Button>
        </div>
      </div>
  );
}