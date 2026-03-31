import { Router } from 'express'
import { asyncHandler, databaseConfigured, requireFields } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'
import { hashPassword, serializeUser } from '../lib/auth.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (_request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const users = await prisma.user.findMany({
      include: {
        role: true,
        branch: true,
        employee: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    response.json(users.map(serializeUser))
  }),
)

router.post(
  '/',
  asyncHandler(async (request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const missingFields = requireFields(request.body, [
      'username',
      'password',
      'displayName',
      'roleId',
      'branchId',
    ])

    if (missingFields.length > 0) {
      response.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
      return
    }

    const passwordHash = await hashPassword(String(request.body.password))

    const user = await prisma.user.create({
      data: {
        username: String(request.body.username).trim(),
        passwordHash,
        displayName: String(request.body.displayName).trim(),
        status: request.body.status ? String(request.body.status).trim().toUpperCase() : 'ACTIVE',
        roleId: String(request.body.roleId).trim(),
        branchId: String(request.body.branchId).trim(),
        employeeId: request.body.employeeId ? String(request.body.employeeId).trim() : null,
      },
      include: {
        role: true,
        branch: true,
        employee: true,
      },
    })

    response.status(201).json(serializeUser(user))
  }),
)

export { router as usersRouter }
