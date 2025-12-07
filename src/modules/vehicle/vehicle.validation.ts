import z from "zod";

export const createVehicleSchema = z.object({
  body: z
    .object({
      vehicle_name: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Vehicle name is required";
            } else if (iss?.code === "invalid_type") {
              return "Vehicle name must be a string";
            }
          },
        })
        .min(2, "Vehicle name must be at least 2 characters long"),
      type: z.enum(["car", "bike", "van", "SUV"], {
        error: () => "Type must be one of: car, bike, van, SUV",
      }),
      registration_number: z
        .string({
          error: (iss) => {
            if (!iss?.input) {
              return "Registration number is required";
            } else if (iss?.code === "invalid_type") {
              return "Registration number must be a string";
            }
          },
        })
        .min(1, "Registration number cannot be empty"),
      daily_rent_price: z
        .number({
          error: (iss) => {
            if (!iss?.input) {
              return "Daily rent price is required";
            } else if (iss?.code === "invalid_type") {
              return "Daily rent price must be a number";
            }
          },
        })
        .positive("Daily rent price must be a positive number"),
    })
    .strict(),
});

export const updateVehicleSchema = z.object({
  body: z.object({
    vehicle_name: z
      .string()
      .min(2, "Vehicle name must be at least 2 characters long")
      .optional(),
    type: z
      .enum(["car", "bike", "van", "SUV"], {
        error: () => "Type must be one of: car, bike, van, SUV",
      })
      .optional(),
    registration_number: z
      .string()
      .min(1, "Registration number cannot be empty")
      .optional(),
    daily_rent_price: z
      .number()
      .positive("Daily rent price must be a positive number")
      .optional(),
    availability_status: z
      .enum(["available", "booked"], {
        error: () => "Availability status must be: available or booked",
      })
      .optional(),
  }),
  params: z.object({
    vehicleId: z
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
  }),
});

export const getVehiclesQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    type: z.enum(["car", "bike", "van", "SUV"]).optional(),
    availability_status: z.enum(["available", "booked"]).optional(),
    sortBy: z
      .enum(["created_at", "daily_rent_price", "vehicle_name"])
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// Types
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>["body"];
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>["body"];
export type GetVehiclesQuery = z.infer<typeof getVehiclesQuerySchema>["query"];
