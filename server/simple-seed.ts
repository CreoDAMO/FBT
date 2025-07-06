import { storage } from "./storage";

export async function simpleSeed() {
  try {
    console.log("Starting simple database seeding...");
    
    // Create sample users
    await storage.createUser({
      username: "admin",
      email: "admin@fastbite.com", 
      password: "admin123",
      role: "admin",
      firstName: "Admin",
      lastName: "User"
    });

    await storage.createUser({
      username: "driver1",
      email: "driver1@fastbite.com",
      password: "driver123", 
      role: "driver",
      firstName: "John",
      lastName: "Driver"
    });

    await storage.createUser({
      username: "merchant1",
      email: "merchant1@fastbite.com",
      password: "merchant123",
      role: "merchant", 
      firstName: "Restaurant",
      lastName: "Owner"
    });

    await storage.createUser({
      username: "customer1",
      email: "customer1@fastbite.com",
      password: "customer123",
      role: "customer",
      firstName: "Jane",
      lastName: "Customer"
    });

    console.log("✓ Database seeded with sample users");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}