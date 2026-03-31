import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () =>
  new PrismaClient({
    log: ['error', 'warn'],
  })

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
