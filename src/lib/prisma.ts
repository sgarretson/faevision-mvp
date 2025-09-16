import { PrismaClient } from '../generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.VERCEL_ENV === 'preview' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  }).$extends(withAccelerate())
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
