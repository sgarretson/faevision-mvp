import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding FAEVision database with basic data...')

  // Create basic users
  const hashedPassword = await bcrypt.hash('demo123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@faevision.com' },
    update: {},
    create: {
      email: 'admin@faevision.com',
      name: 'System Administrator',
      role: 'ADMIN',
      department: 'IT',
      passwordHash: hashedPassword,
    },
  })

  const executive = await prisma.user.upsert({
    where: { email: 'executive@faevision.com' },
    update: {},
    create: {
      email: 'executive@faevision.com',
      name: 'Executive User',
      role: 'EXECUTIVE',
      department: 'Leadership',
      passwordHash: hashedPassword,
    },
  })

  const contributor = await prisma.user.upsert({
    where: { email: 'contributor@faevision.com' },
    update: {},
    create: {
      email: 'contributor@faevision.com',
      name: 'Contributor User',
      role: 'CONTRIBUTOR',
      department: 'Operations',
      passwordHash: hashedPassword,
    },
  })

  console.log('✅ Basic seed data created successfully')
  console.log('👥 Users created:')
  console.log(`  - Admin: ${admin.email}`)
  console.log(`  - Executive: ${executive.email}`)
  console.log(`  - Contributor: ${contributor.email}`)
  console.log('🔑 All users password: demo123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
