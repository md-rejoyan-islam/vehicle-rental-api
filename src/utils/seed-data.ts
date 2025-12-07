import bcrypt from "bcryptjs";
import { pool } from "../config/db";
import { resetDatabase } from "../config/db-sync";

interface DemoUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}

interface DemoVehicle {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | "booked";
}

interface DemoBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: "active" | "cancelled" | "returned";
}

// Demo Users Data
const demoUsers: DemoUser[] = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    phone: "01712345678",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "01812345678",
    role: "customer",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    phone: "01912345678",
    role: "customer",
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    phone: "01712345679",
    role: "customer",
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    password: "password123",
    phone: "01712345680",
    role: "customer",
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123",
    phone: "01712345681",
    role: "customer",
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    password: "password123",
    phone: "01712345682",
    role: "customer",
  },
  {
    name: "Edward Norton",
    email: "edward@example.com",
    password: "password123",
    phone: "01712345683",
    role: "customer",
  },
  {
    name: "Fiona Green",
    email: "fiona@example.com",
    password: "password123",
    phone: "01712345684",
    role: "customer",
  },
  {
    name: "George Clark",
    email: "george@example.com",
    password: "password123",
    phone: "01712345685",
    role: "customer",
  },
];

// Demo Vehicles Data (using correct column names from IVehicle)
const demoVehicles: DemoVehicle[] = [
  {
    vehicle_name: "Toyota Corolla",
    type: "car",
    registration_number: "TOYOTA-001",
    daily_rent_price: 50,
    availability_status: "available",
  },
  {
    vehicle_name: "Honda Civic",
    type: "car",
    registration_number: "HONDA-001",
    daily_rent_price: 55,
    availability_status: "available",
  },
  {
    vehicle_name: "BMW X5",
    type: "SUV",
    registration_number: "BMW-001",
    daily_rent_price: 150,
    availability_status: "available",
  },
  {
    vehicle_name: "Mercedes-Benz C-Class",
    type: "car",
    registration_number: "MERC-001",
    daily_rent_price: 120,
    availability_status: "available",
  },
  {
    vehicle_name: "Hyundai Creta",
    type: "SUV",
    registration_number: "HYUNDAI-001",
    daily_rent_price: 60,
    availability_status: "available",
  },
  {
    vehicle_name: "Maruti Swift",
    type: "car",
    registration_number: "MARUTI-001",
    daily_rent_price: 35,
    availability_status: "available",
  },
  {
    vehicle_name: "Volkswagen Jetta",
    type: "car",
    registration_number: "VW-001",
    daily_rent_price: 70,
    availability_status: "available",
  },
  {
    vehicle_name: "Audi A4",
    type: "car",
    registration_number: "AUDI-001",
    daily_rent_price: 130,
    availability_status: "available",
  },
  {
    vehicle_name: "Ford EcoSport",
    type: "SUV",
    registration_number: "FORD-001",
    daily_rent_price: 65,
    availability_status: "available",
  },
  {
    vehicle_name: "Skoda Octavia",
    type: "car",
    registration_number: "SKODA-001",
    daily_rent_price: 75,
    availability_status: "available",
  },
];

/**
 * Seed database with demo data
 * Run this function to populate the database with test data
 */
export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Reset database (drop all tables and recreate them)
    console.log("🔄 Resetting database schema...");
    await resetDatabase();
    console.log("✓ Database schema ready\n");

    // Seed Users
    console.log("👥 Seeding users...");
    const userIds: number[] = [];

    for (const user of demoUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id`,
        [user.name, user.email, hashedPassword, user.phone, user.role]
      );
      userIds.push(result.rows[0].id);
      console.log(`✓ Created user: ${user.name}`);
    }

    // Seed Vehicles
    console.log("\n🚗 Seeding vehicles...");
    const vehicleIds: number[] = [];

    for (const vehicle of demoVehicles) {
      const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id`,
        [
          vehicle.vehicle_name,
          vehicle.type,
          vehicle.registration_number,
          vehicle.daily_rent_price,
          vehicle.availability_status,
        ]
      );
      vehicleIds.push(result.rows[0].id);
      console.log(`✓ Created vehicle: ${vehicle.vehicle_name}`);
    }

    // Seed Bookings (create 10 demo bookings with different statuses and dates)
    console.log("\n📅 Seeding demo bookings...");

    // Create 10 bookings with varied details
    const demoBookingsData = [
      {
        userIndex: 1,
        vehicleIndex: 0,
        daysOffset: 2,
        duration: 3,
        status: "active" as const,
      },
      {
        userIndex: 2,
        vehicleIndex: 1,
        daysOffset: 5,
        duration: 5,
        status: "active" as const,
      },
      {
        userIndex: 3,
        vehicleIndex: 2,
        daysOffset: 10,
        duration: 7,
        status: "active" as const,
      },
      {
        userIndex: 4,
        vehicleIndex: 3,
        daysOffset: 15,
        duration: 4,
        status: "returned" as const,
      },
      {
        userIndex: 5,
        vehicleIndex: 4,
        daysOffset: 1,
        duration: 2,
        status: "returned" as const,
      },
      {
        userIndex: 6,
        vehicleIndex: 5,
        daysOffset: 8,
        duration: 6,
        status: "active" as const,
      },
      {
        userIndex: 7,
        vehicleIndex: 6,
        daysOffset: 12,
        duration: 3,
        status: "cancelled" as const,
      },
      {
        userIndex: 8,
        vehicleIndex: 7,
        daysOffset: 3,
        duration: 5,
        status: "active" as const,
      },
      {
        userIndex: 9,
        vehicleIndex: 8,
        daysOffset: 20,
        duration: 2,
        status: "active" as const,
      },
      {
        userIndex: 1,
        vehicleIndex: 9,
        daysOffset: 7,
        duration: 4,
        status: "returned" as const,
      },
    ];

    const today = new Date();

    for (const booking of demoBookingsData) {
      const customerId = userIds[booking.userIndex];
      const vehicleId = vehicleIds[booking.vehicleIndex];

      // Calculate start and end dates
      const rentStartDate = new Date(today);
      rentStartDate.setDate(rentStartDate.getDate() + booking.daysOffset);

      const rentEndDate = new Date(rentStartDate);
      rentEndDate.setDate(rentEndDate.getDate() + booking.duration);

      // Get vehicle price
      const vehicleResult = await pool.query(
        `SELECT daily_rent_price FROM vehicles WHERE id = $1`,
        [vehicleId]
      );
      const dailyRentPrice = vehicleResult.rows[0].daily_rent_price;

      // Calculate total price
      const daysRented = booking.duration;
      const totalPrice = dailyRentPrice * daysRented;

      const result = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id`,
        [
          customerId,
          vehicleId,
          rentStartDate.toISOString().split("T")[0],
          rentEndDate.toISOString().split("T")[0],
          totalPrice,
          booking.status,
        ]
      );

      const vehicleResult2 = await pool.query(
        `SELECT vehicle_name FROM vehicles WHERE id = $1`,
        [vehicleId]
      );
      const vehicleName = vehicleResult2.rows[0].vehicle_name;

      console.log(
        `✓ Booking #${result.rows[0].id}: ${vehicleName} | Status: ${booking.status} | ${daysRented} days | $${totalPrice}`
      );
    }

    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
  seedDatabase();
}
