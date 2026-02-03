const { z } = require("zod");

/**
 * Validation concept:
 * We never trust client input.
 * Zod checks shape + types + constraints.
 */
const signupSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "password must be at least 8 characters"),
  gender: z.string().optional(),
  experienceLevel: z.string().optional(),
  goal: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "password is required"),
});

module.exports = { signupSchema, loginSchema };

