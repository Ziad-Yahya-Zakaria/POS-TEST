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

    const products = await prisma.product.findMany({
      include: {
        branch: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    response.json(products)
  }),
)

router.post(
  '/',
  asyncHandler(async (request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const missingFields = requireFields(request.body, [
      'sku',
      'name',
      'salePrice',
      'costPrice',
      'branchId',
      'categoryId',
    ])

    if (missingFields.length > 0) {
      response.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
      return
    }

    const product = await prisma.product.create({
      data: {
        sku: String(request.body.sku).trim().toUpperCase(),
        name: String(request.body.name).trim(),
        barcode: request.body.barcode ? String(request.body.barcode).trim() : null,
        salePrice: Number(request.body.salePrice),
        costPrice: Number(request.body.costPrice),
        stockOnHand: request.body.stockOnHand ? Number(request.body.stockOnHand) : 0,
        reorderLevel: request.body.reorderLevel ? Number(request.body.reorderLevel) : 0,
        unitName: request.body.unitName ? String(request.body.unitName).trim() : 'قطعة',
        isActive: request.body.isActive !== false,
        branchId: String(request.body.branchId).trim(),
        categoryId: String(request.body.categoryId).trim(),
      },
      include: {
        branch: true,
        category: true,
      },
    })

    response.status(201).json(product)
  }),
)

export { router as productsRouter }
