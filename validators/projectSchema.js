const { z } = require("zod");

exports.projectSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(5)
});