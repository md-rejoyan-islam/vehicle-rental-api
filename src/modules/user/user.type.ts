export type ROLE = "admin" | "customer";

export interface IUser {
  id: number; // auto generated
  name: string;
  email: string;
  password: string;
  phone: string;
  role: ROLE;
  created_at: Date;
  updated_at: Date;
}
