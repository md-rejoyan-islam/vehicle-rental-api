export interface IBooking {
  id: number; // auto generated IDENTITY
  customer_id: number; // Link to IUser
  vehicle_id: number; // Link to IVehicle
  rent_start_date: Date;
  rent_end_date: Date;
  total_price: number;
  status: "active" | "cancelled" | "returned";
  created_at: Date;
  updated_at: Date;
}
