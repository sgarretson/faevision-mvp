import { PrismaClient } from '../../src/generated/prisma'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

// Always use global in serverless environments to prevent connection pooling issues
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV) {
  globalThis.prisma = prisma
}
