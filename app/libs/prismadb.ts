import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if ( process.env.NODE_ENV !== 'production') // if not in production then we set prisma globalThis to this newly created client
    globalThis.prisma = client // this is to prevent hot reload from creating new clients

export default client;