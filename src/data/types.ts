
export type Roast = {
  imageSrc: string
  prompt: string | undefined | null
  status: Status
  roast: string | undefined | null
}

export enum Status {
  Pending = "PENDING",
  Success = "SUCCESS",
  Failed = "FAILED",
}