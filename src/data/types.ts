
export type Roast = {
  imageSrc: string
  prompt: string | undefined | null
  status: Status
  basic_roast: string | undefined | null
  augmented_roast: string | undefined | null
}

export enum Status {
  Pending = "PENDING",
  Success = "SUCCESS",
  Failed = "FAILED",
}

export type InferenceProps = {
  temperature: number
  prompt: string
  systemPrompt: string
  topP: number
  maxNewTokens: number
  imageFile: File | null
}