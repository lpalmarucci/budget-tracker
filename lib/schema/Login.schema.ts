import * as z from "zod";

const LoginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8),
});

export default LoginSchema;
