import { Router } from 'express'
import { asyncHandler, databaseConfigured, requireFields } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (_request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    })

    response.json(customers)
  }),
)

router.post(
  '/',
  asyncHandler(async (request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const missingFields = requireFields(request.body, ['code', 'name'])

    if (missingFields.length > 0) {
      response.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
      return
    }

    const customer = await prisma.customer.create({
      data: {
        code: String(request.body.code).trim().toUpperCase(),
        name: String(request.body.name).trim(),
        phone: request.body.phone ? String(request.body.phone).trim() : null,
        email: request.body.email ? String(request.body.email).trim() : null,
        address: request.body.address ? String(request.body.address).trim() : null,
        creditLimit: request.body.creditLimit ? Number(request.body.creditLimit) : 0,
        isActive: request.body.isActive !== false,
      },
    })

    response.status(201).json(customer)
  }),
)

export { router as customersRouter }
