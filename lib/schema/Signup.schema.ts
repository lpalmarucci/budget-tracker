import * as z from "zod";

const SignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  password: z.string().min(8),
});

export default SignupSchema;
