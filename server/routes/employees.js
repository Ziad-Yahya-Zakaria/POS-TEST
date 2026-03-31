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

    const employees = await prisma.employee.findMany({
      include: {
        branch: true,
        user: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    response.json(employees)
  }),
)

router.post(
  '/',
  asyncHandler(async (request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const missingFields = requireFields(request.body, ['employeeCode', 'firstName', 'lastName', 'branchId'])

    if (missingFields.length > 0) {
      response.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
      return
    }

    const employee = await prisma.employee.create({
      data: {
        employeeCode: String(request.body.employeeCode).trim().toUpperCase(),
        firstName: String(request.body.firstName).trim(),
        lastName: String(request.body.lastName).trim(),
        phone: request.body.phone ? String(request.body.phone).trim() : null,
        status: request.body.status ? String(request.body.status).trim().toUpperCase() : 'ACTIVE',
        nfcCardCode: request.body.nfcCardCode
          ? String(request.body.nfcCardCode).trim().toUpperCase()
          : null,
        branchId: String(request.body.branchId).trim(),
      },
      include: {
        branch: true,
      },
    })

    response.status(201).json(employee)
  }),
)

export { router as employeesRouter }
