import * as z from "zod";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export default LoginSchema;
