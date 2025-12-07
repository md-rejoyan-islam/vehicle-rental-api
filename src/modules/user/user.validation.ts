import z from "zod";

export const updateUserSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
  body: z
    .object({
      name: z
        .string({
          error: (iss) => {
            if (iss?.code === "invalid_type") {
              return "Name must be a string";
            }
          },
        })
        .min(2, "Name must be at least 2 characters long")
        .optional(),
      email: z
        .string({
          error: (iss) => {
            if (iss?.code === "invalid_type") {
              return "Email must be a string";
            }
          },
        })
        .email("Please provide a valid email address")
        .optional(),
      phone: z
        .string({
          error: (iss) => {
            if (iss?.code === "invalid_type") {
              return "Phone must be a string";
            }
          },
        })
        .min(10, "Phone number must be at least 10 characters long")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    })
    .strict(),
});

export const deleteUserSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
});

// Type inference for query validation
export type GetUsersQuery = {
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
};
