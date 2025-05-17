const { z } = require("zod");

exports.userSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["freelancer", "client"])
});