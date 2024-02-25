import {z} from "zod";

export const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }).max(512, {
    message: "Prompt must be at most 512 characters.",
  }),
  systemPrompt: z.string().min(  2, {
    message: "System Prompt must be at least 2 characters.",
  }).max(512, {
    message: "System Prompt must be at most 512 characters.",
  }),
  temperature: z.coerce.number().min(0, {
    message: "Temperature must a number greater than 0",
  }).max(1, {
    message: "Temperature must be at most 1",
  }).default(0.2),
  topP: z.coerce.number().min(0, {
      message: "Top P must a number greater than 0",
  }).max(1, {
      message: "Top P must be at most 1",
  }).default(0.2),
  maxNewTokens: z.coerce.number().min(1, {
      message: "Max New Tokens must a number greater than 1",
  }).max(512, {
      message: "Max New Tokens must be at most 512",
  }).default(512),
  imageSrc: z.optional(z.string()),
  loraName: z.string(),
})
