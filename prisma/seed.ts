import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Admin ────────────────────────────────────────────────
  console.log("Seeding admin...");

  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed },
  });

  console.log(`Admin seeded → ${email}`);

  // ── Sample orders ────────────────────────────────────────
  console.log("Seeding sample orders...");

  await prisma.order.deleteMany();

  await prisma.order.createMany({
    data: [
      {
        fullName: "Rahim Uddin",
        phone: "01711-111111",
        address: "12/A Mirpur Road",
        city: "Dhaka",
        deliveryType: "courier",
        deliveryDate: new Date("2026-06-15"),
        notes: "Please pack carefully.",
        subtotal: 1200,
        total: 1350,
      },
      {
        fullName: "Karim Hossain",
        phone: "01822-222222",
        address: "45 Agrabad",
        city: "Chattogram",
        deliveryType: "home",
        deliveryDate: new Date("2026-06-18"),
        notes: null,
        subtotal: 800,
        total: 800,
      },
      {
        fullName: "Nasrin Akter",
        phone: "01933-333333",
        address: "7 Shaheb Bazar",
        city: "Rajshahi",
        deliveryType: "courier",
        deliveryDate: new Date("2026-06-20"),
        notes: "Call before delivery.",
        subtotal: 2000,
        total: 2150,
      },
    ],
  });

  const orders = await prisma.order.findMany();
  const [order1, order2, order3] = orders as [typeof orders[0], typeof orders[0], typeof orders[0]];

  await prisma.orderItem.createMany({
    data: [
      { orderId: order1!.id, variety: "Himsagar", quantity: 3, price: 300 },
      { orderId: order1!.id, variety: "Langra", quantity: 2, price: 250 },
      { orderId: order2!.id, variety: "Amrapali", quantity: 4, price: 200 },
      { orderId: order3!.id, variety: "Fazli", quantity: 5, price: 350 },
      { orderId: order3!.id, variety: "Himsagar", quantity: 1, price: 300 },
    ],
  });

  console.log(`Seeded ${orders.length} orders with items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
