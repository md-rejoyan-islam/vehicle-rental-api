import { pool } from "../../config/db";

export const bookingTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date TIMESTAMP NOT NULL,
      rent_end_date TIMESTAMP NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
