const { z } = require("zod");

exports.userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});