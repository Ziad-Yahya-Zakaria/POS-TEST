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

    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    })

    response.json(roles)
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

    const code = String(request.body.code).trim().toUpperCase()
    const name = String(request.body.name).trim()
    const description = request.body.description ? String(request.body.description).trim() : null

    const role = await prisma.role.create({
      data: { code, name, description },
    })

    response.status(201).json(role)
  }),
)

export { router as rolesRouter }
