
export type Roast = {
  id: string
  displayImage: boolean
  imageSrc: string
  fullPrompt: string | undefined | null
  status: Status
  basicRoast: string | undefined | null
  augmentedRoast: string | undefined | null
} & InferenceProps

export enum Status {
  Pending = "PENDING",
  Streaming = "STREAMING",
  Success = "SUCCESS",
  Failed = "FAILED",
}

export type InferenceProps = {
  lora?: LoraProps | undefined
  temperature: number
  prompt: string
  // systemPrompt: string
  topP: number
  maxNewTokens: number
  imageFile: File | null | undefined
}


export type LoraProps = {
  path: string
  displayName: string
}