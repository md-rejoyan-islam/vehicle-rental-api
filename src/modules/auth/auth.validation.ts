import z from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Name is required";
            } else if (iss?.code === "invalid_type") {
              return "Name must be a string";
            }
          },
        })
        .min(2, "Name must be at least 2 characters long"),
      email: z.email({
        error: (iss) => {
          if (!iss?.input) {
            return "Email is required";
          } else if (iss?.code === "invalid_type") {
            return "Email must be a string";
          } else if (iss?.code === "invalid_format") {
            return "Please provide a valid email address";
          }
        },
      }),
      password: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Password is required";
            } else if (iss?.code === "invalid_type") {
              return "Password must be a string";
            }
          },
        })
        .min(6, "Password must be at least 6 characters long"),
      phone: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Phone is required";
            } else if (iss?.code === "invalid_type") {
              return "Phone must be a string";
            }
          },
        })
        .min(10, "Phone number must be at least 10 characters long"),
      role: z
        .enum(["admin", "customer"], {
          error: (iss) => {
            if (iss?.input && iss?.code === "invalid_value") {
              return "Role must be either 'admin' or 'customer'";
            }
          },
        })
        .optional(),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.email({
        error: (iss) => {
          if (!iss?.input) {
            return "Email is required";
          } else if (iss?.code === "invalid_type") {
            return "Email must be a string";
          } else if (iss?.code === "invalid_format") {
            return "Please provide a valid email address";
          }
        },
      }),
      password: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Password is required";
            } else if (iss?.code === "invalid_type") {
              return "Password must be a string";
            }
          },
        })
        .min(6, "Password must be at least 6 characters long"),
    })
    .strict(),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
