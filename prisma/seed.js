const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('testpass', 10);

  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'Client A',
      email: 'client@example.com',
      password,
      role: 'client',
    },
  });

  const freelancer = await prisma.user.upsert({
    where: { email: 'freelancer@example.com' },
    update: {},
    create: {
      name: 'Freelancer B',
      email: 'freelancer@example.com',
      password,
      role: 'freelancer',
    },
  });

  await prisma.project.createMany({
    data: [
      { title: 'LP制作', detail: 'LPデザインとコーディング', clientId: client.id },
      { title: 'API開発', detail: 'Node.jsとPostgreSQLで構築', clientId: client.id }
    ]
  });
}

main()
  .then(() => console.log('✅ Seed completed'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());