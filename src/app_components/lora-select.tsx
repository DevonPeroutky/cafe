import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import React, {useEffect} from "react";
import {useRecoilState} from "recoil";
import {lorasState} from "@/data/local-state/loras.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useFormContext} from "react-hook-form";


export const LoraSelect = () => {
  const { setValue, control } = useFormContext()
  const [loras, setLoras] = useRecoilState(lorasState)

  useEffect(() => {
    if (loras && loras.length > 0) {
      setValue("loraName", loras && loras[0] && loras[0].displayName)
    }
  }, [loras]);

  return (
      <FormField
          name="loraName"
          control={control}
          render={({field}) => {

            console.log(`FIELD: `, field)
            return (
                <FormItem className="w-full">
                  <FormLabel>Model</FormLabel>
                  <FormControl className="w-full cursor-pointer">
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={loras[0] ? loras[0].displayName : "Loading" } {...field} defaultValue={field.value}/>
                      </SelectTrigger>
                      <SelectContent className="w-full cursor-pointer">
                        {loras.map((lora) => (
                            <SelectItem key={lora.displayName} value={lora.displayName} className="w-full cursor-pointer">
                              {lora.displayName}
                            </SelectItem>
                        ))}
                        <SelectItem key="base-model" value={"Jibberish and not in the list"} className="w-full cursor-pointer">Base Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a specfic model version
                  </FormDescription>
                  <FormMessage/>
                </FormItem>)
          }}
      />
  )
}