import {z} from "zod";

export const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }).max(512, {
    message: "Prompt must be at most 512 characters.",
  }),
  system_prompt: z.string().min(  2, {
    message: "System Prompt must be at least 2 characters.",
  }).max(512, {
    message: "System Prompt must be at most 512 characters.",
  }),
  temperature: z.number().min(0, {
    message: "Temperature must a number greater than 0",
  }).max(1, {
    message: "Temperature must be at most 1",
  }).default(0.2),
  top_p: z.number().min(0, {
      message: "Top P must a number greater than 0",
  }).max(1, {
      message: "Top P must be at most 1",
  }).default(0.2),
  max_new_tokens: z.number().min(0, {
      message: "Max New Tokens must a number greater than 0",
  }).max(512, {
      message: "Max New Tokens must be at most 512",
  }).default(512),
})
