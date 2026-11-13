import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function clean() {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const res = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { startsWith: "fresh_student_" } },
          { email: { startsWith: "new_student_" } },
        ],
      },
    });
    console.log(`Successfully removed ${res.count} test verification user(s).`);
  } catch (e) {
    console.error("Cleanup error:", e);
  } finally {
    process.exit(0);
  }
}

clean();
