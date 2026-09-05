import 'dotenv/config';

import { prisma } from '../src/database/prisma.js';
import { hashPassword } from '../src/security/password.js';

const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminName || !adminEmail || !adminPassword) {
  throw new Error('ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be defined');
}

const existingAdmin = await prisma.user.findFirst({
  where: {
    role: 'ADMIN',
  },
});

if (existingAdmin) {
  console.log('Admin already exists.');
  await prisma.$disconnect();
  process.exit(0);
}

const passwordHash = await hashPassword(adminPassword);

const admin = await prisma.user.create({
  data: {
    name: adminName,
    email: adminEmail,
    passwordHash,
    role: 'ADMIN',
    status: 'ACTIVE',
  },
});

console.log(`Admin created: ${admin.email}`);

await prisma.$disconnect();
