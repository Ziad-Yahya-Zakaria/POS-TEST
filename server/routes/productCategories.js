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

    const categories = await prisma.productCategory.findMany({
      orderBy: { name: 'asc' },
    })

    response.json(categories)
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

    const category = await prisma.productCategory.create({
      data: {
        code: String(request.body.code).trim().toUpperCase(),
        name: String(request.body.name).trim(),
        description: request.body.description ? String(request.body.description).trim() : null,
      },
    })

    response.status(201).json(category)
  }),
)

export { router as productCategoriesRouter }
