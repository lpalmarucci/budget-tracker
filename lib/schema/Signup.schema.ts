import * as z from "zod";

const SignupSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(8),
});

export default SignupSchema;
