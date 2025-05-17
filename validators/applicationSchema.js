const { z } = require("zod");

exports.applicationSchema = z.object({
  projectId: z.number().int().positive()
});