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

    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'asc' },
    })

    response.json(branches)
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

    const branch = await prisma.branch.create({
      data: {
        code: String(request.body.code).trim().toUpperCase(),
        name: String(request.body.name).trim(),
        phone: request.body.phone ? String(request.body.phone).trim() : null,
        address: request.body.address ? String(request.body.address).trim() : null,
        isHeadOffice: Boolean(request.body.isHeadOffice),
      },
    })

    response.status(201).json(branch)
  }),
)

export { router as branchesRouter }
