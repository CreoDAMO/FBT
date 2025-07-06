import { storage } from "./storage";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Create sample users
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@fastbite.com", 
      password: "admin123",
      role: "admin",
      firstName: "Admin",
      lastName: "User"
    });

    const driverUser = await storage.createUser({
      username: "driver1",
      email: "driver1@fastbite.com",
      password: "driver123", 
      role: "driver",
      firstName: "John",
      lastName: "Driver"
    });

    const merchantUser = await storage.createUser({
      username: "merchant1",
      email: "merchant1@fastbite.com",
      password: "merchant123",
      role: "merchant", 
      firstName: "Restaurant",
      lastName: "Owner"
    });

    const customerUser = await storage.createUser({
      username: "customer1",
      email: "customer1@fastbite.com",
      password: "customer123",
      role: "customer",
      firstName: "Jane",
      lastName: "Customer"
    });

    console.log("✓ Created sample users");

    // Create sample restaurant
    const restaurant = await storage.createRestaurant({
      name: "Pizza Palace",
      description: "Authentic Italian pizza and pasta",
      address: "123 Main St, Downtown",
      phone: "+1-555-0123",
      email: "orders@pizzapalace.com",
      cuisineType: "Italian",
      ownerId: merchantUser.id,
      isActive: true,
      deliveryRadius: 15.5
    });

    console.log("✓ Created sample restaurant");

    // Create sample menu items
    const menuItems = [
      {
        name: "Margherita Pizza",
        description: "Fresh tomatoes, mozzarella, and basil",
        price: "16.99",
        category: "Pizza",
        restaurantId: restaurant.id,
        isAvailable: true
      },
      {
        name: "Pepperoni Pizza", 
        description: "Classic pepperoni with mozzarella cheese",
        price: "18.99",
        category: "Pizza",
        restaurantId: restaurant.id,
        isAvailable: true
      },
      {
        name: "Caesar Salad",
        description: "Crispy romaine lettuce with Caesar dressing",
        price: "12.99", 
        category: "Salads",
        restaurantId: restaurant.id,
        isAvailable: true
      }
    ];

    for (const item of menuItems) {
      await storage.createMenuItem(item);
    }

    console.log("✓ Created sample menu items");

    // Create sample driver profile
    await storage.createDriver({
      userId: driverUser.id,
      licenseNumber: "DL123456789",
      vehicleType: "car",
      vehicleModel: "Honda Civic",
      currentLatitude: 40.7128,
      currentLongitude: -74.0060
    });

    console.log("✓ Created sample driver profile");

    // Create sample campaign
    const campaign = await storage.createCampaign({
      title: "FastBite Pro Funding Round",
      description: "Join our Series A funding round to expand FastBite Pro globally",
      goalAmount: "5000000",
      raisedAmount: "2250000",
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      status: "active"
    });

    console.log("✓ Created sample campaign");

    // Create sample token
    const fbtToken = await storage.createToken({
      symbol: "FBT",
      name: "FastBite Token",
      totalSupply: "1000000000"
    });

    console.log("✓ Created FBT token");

    // Create sample orders with metrics
    const sampleOrders = [
      {
        customerId: customerUser.id,
        restaurantId: restaurant.id,
        driverId: driverUser.id,
        orderNumber: "ORD-001",
        status: "delivered",
        totalAmount: "29.97",
        deliveryAddress: "456 Oak Ave, City",
        specialInstructions: "Ring doorbell twice"
      },
      {
        customerId: customerUser.id,
        restaurantId: restaurant.id,
        orderNumber: "ORD-002",
        status: "pending",
        totalAmount: "18.99",
        deliveryAddress: "789 Pine St, City",
        specialInstructions: ""
      }
    ];

    for (const orderData of sampleOrders) {
      await storage.createOrder(orderData);
    }

    console.log("✓ Created sample orders");

    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}