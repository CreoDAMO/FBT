import { storage } from "./storage";

export async function simpleSeed() {
  try {
    console.log("Starting simple database seeding...");

    const users = [
      {
        username: "admin",
        email: "admin@fastbite.com", 
        password: "admin123",
        role: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      {
        username: "driver1",
        email: "driver1@fastbite.com",
        password: "driver123", 
        role: "driver",
        firstName: "John",
        lastName: "Driver"
      },
      {
        username: "merchant1",
        email: "merchant1@fastbite.com",
        password: "merchant123",
        role: "merchant", 
        firstName: "Restaurant",
        lastName: "Owner"
      },
      {
        username: "customer1",
        email: "customer1@fastbite.com",
        password: "customer123",
        role: "customer",
        firstName: "Jane",
        lastName: "Customer"
      }
    ];

    // Create users only if they don't exist
    for (const userData of users) {
      try {
        const existingUser = await storage.getUserByUsername(userData.username);
        if (!existingUser) {
          await storage.createUser(userData);
          console.log(`✓ Created user: ${userData.username}`);
        } else {
          console.log(`• User ${userData.username} already exists, skipping`);
        }
      } catch (error: any) {
      if (error.message?.includes('certificate')) {
        console.log(`• Database SSL configuration needed for user ${userData.username}`);
      } else {
        console.log(`• Failed to create user ${userData.username}: ${error.message}`);
      }
    }
    }

    console.log("✓ Database seeding completed");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}