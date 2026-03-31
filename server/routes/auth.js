import { Router } from 'express'
import { asyncHandler, databaseConfigured, requireFields } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'
import { serializeUser, verifyPassword } from '../lib/auth.js'

const router = Router()

router.post(
  '/login',
  asyncHandler(async (request, response) => {
    const method = String(request.body?.method ?? 'user').toLowerCase()

    if (!databaseConfigured(response)) {
      return
    }

    if (method === 'user') {
      const missingFields = requireFields(request.body, ['username', 'password'])

      if (missingFields.length > 0) {
        response.status(400).json({
          message: `Missing required fields: ${missingFields.join(', ')}`,
        })
        return
      }

      const username = String(request.body.username).trim()
      const password = String(request.body.password)

      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          role: true,
          branch: true,
          employee: true,
        },
      })

      if (!user || user.status !== 'ACTIVE') {
        response.status(401).json({ message: 'Invalid username or password.' })
        return
      }

      const validPassword = await verifyPassword(password, user.passwordHash)

      if (!validPassword) {
        response.status(401).json({ message: 'Invalid username or password.' })
        return
      }

      response.json({
        success: true,
        loginMethod: 'user',
        user: serializeUser(user),
        session: {
          loginAt: new Date().toISOString(),
        },
      })

      return
    }

    if (method === 'nfc') {
      const nfcCardCode = String(request.body?.nfc ?? request.body?.cardCode ?? '').trim()

      if (!nfcCardCode) {
        response.status(400).json({ message: 'NFC card code is required.' })
        return
      }

      const employee = await prisma.employee.findUnique({
        where: { nfcCardCode },
        include: {
          branch: true,
          user: {
            include: {
              role: true,
              branch: true,
              employee: true,
            },
          },
        },
      })

      if (!employee || !employee.user || employee.status !== 'ACTIVE') {
        response.status(401).json({ message: 'NFC card is not linked to an active user.' })
        return
      }

      if (employee.user.status !== 'ACTIVE') {
        response.status(401).json({ message: 'User account is not active.' })
        return
      }

      response.json({
        success: true,
        loginMethod: 'nfc',
        user: serializeUser(employee.user),
        session: {
          loginAt: new Date().toISOString(),
        },
      })

      return
    }

    response.status(400).json({ message: 'Unsupported login method.' })
  }),
)

router.get(
  '/bootstrap',
  asyncHandler(async (_request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const [rolesCount, branchesCount, employeesCount, usersCount] = await Promise.all([
      prisma.role.count(),
      prisma.branch.count(),
      prisma.employee.count(),
      prisma.user.count(),
    ])

    response.json({
      rolesCount,
      branchesCount,
      employeesCount,
      usersCount,
      demoCredentials: {
        username: 'cashier01',
        password: '123456',
        nfcCardCode: 'CARD-0148',
      },
    })
  }),
)

export { router as authRouter }
