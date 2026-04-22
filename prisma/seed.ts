import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@dubaix.com";
  const adminPassword = "Admin@123";

  console.log("Seeding admin user...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword, // Note: In a real app, this should be hashed
        firstName: "System",
        lastName: "Admin",
        isVerifiedSeller: true,
      },
    });
    console.log("✅ Admin user created: admin@dubaix.com / Admin@123");
  } else {
    console.log("ℹ️ Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
