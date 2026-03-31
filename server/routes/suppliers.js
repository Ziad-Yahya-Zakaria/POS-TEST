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

    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
    })

    response.json(suppliers)
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

    const supplier = await prisma.supplier.create({
      data: {
        code: String(request.body.code).trim().toUpperCase(),
        name: String(request.body.name).trim(),
        phone: request.body.phone ? String(request.body.phone).trim() : null,
        email: request.body.email ? String(request.body.email).trim() : null,
        address: request.body.address ? String(request.body.address).trim() : null,
        taxNumber: request.body.taxNumber ? String(request.body.taxNumber).trim() : null,
        paymentTerms: request.body.paymentTerms ? String(request.body.paymentTerms).trim() : null,
        isActive: request.body.isActive !== false,
      },
    })

    response.status(201).json(supplier)
  }),
)

export { router as suppliersRouter }
