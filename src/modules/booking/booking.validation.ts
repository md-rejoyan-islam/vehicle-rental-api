import z from "zod";

export const createBookingSchema = z.object({
  body: z
    .object({
      vehicle_id: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Vehicle ID is required";
            } else if (iss?.code === "invalid_type") {
              return "Vehicle ID must be a string";
            }
          },
        })
        .min(1, "Vehicle ID cannot be empty"),
      rent_start_date: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Rent start date is required";
            } else if (iss?.code === "invalid_type") {
              return "Rent start date must be a string";
            }
          },
        })
        .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
      rent_end_date: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Rent end date is required";
            } else if (iss?.code === "invalid_type") {
              return "Rent end date must be a string";
            }
          },
        })
        .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
    })
    .strict(),
});

export const updateBookingSchema = z.object({
  body: z.object({
    action: z.enum(["cancel", "return"], {
      error: () => "Action must be 'cancel' or 'return'",
    }),
  }),
  params: z.object({
    bookingId: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return "Booking ID is required";
          } else if (iss?.code === "invalid_type") {
            return "Booking ID must be a string";
          }
        },
      })
      .min(1, "Booking ID cannot be empty"),
  }),
});

export const getBookingsQuerySchema = z.object({
  query: z.object({
    status: z.enum(["active", "cancelled", "returned"]).optional(),
    sortBy: z.enum(["created_at", "rent_start_date", "total_price"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// Types
export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>["body"];
export type GetBookingsQuery = z.infer<typeof getBookingsQuerySchema>["query"];
