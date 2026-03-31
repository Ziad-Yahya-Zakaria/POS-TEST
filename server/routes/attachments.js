import { unlink } from 'node:fs/promises'
import { extname } from 'node:path'
import crypto from 'node:crypto'
import { Router } from 'express'
import multer from 'multer'
import { attachmentsDirectory, attachmentsDirectoryName } from '../config/paths.js'
import { prisma } from '../lib/prisma.js'
import { databaseConfigured } from '../lib/http.js'

const router = Router()

const allowedOwnerTypes = new Set([
  'USER',
  'EMPLOYEE',
  'BRANCH',
  'PRODUCT',
  'CUSTOMER',
  'SUPPLIER',
  'GENERAL',
])

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, attachmentsDirectory)
  },
  filename: (_request, file, callback) => {
    const extension = extname(file.originalname) || '.bin'
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      callback(new Error('Only image uploads are allowed.'))
      return
    }

    callback(null, true)
  },
})

router.post('/', upload.single('file'), async (request, response, next) => {
  if (!databaseConfigured(response)) {
    if (request.file?.path) {
      await unlink(request.file.path).catch(() => {})
    }

    return
  }

  if (!request.file) {
    response.status(400).json({ message: 'Image file is required.' })
    return
  }

  const ownerType = String(request.body.ownerType ?? 'GENERAL').toUpperCase()
  const ownerId = request.body.ownerId ? String(request.body.ownerId) : null
  const purpose = request.body.purpose ? String(request.body.purpose) : null
  const uploadedByUser = request.body.uploadedByUser
    ? String(request.body.uploadedByUser)
    : null

  if (!allowedOwnerTypes.has(ownerType)) {
    await unlink(request.file.path).catch(() => {})
    response.status(400).json({ message: 'Invalid attachment owner type.' })
    return
  }

  try {
    const attachment = await prisma.attachment.create({
      data: {
        ownerType,
        ownerId,
        purpose,
        originalName: request.file.originalname,
        storedFileName: request.file.filename,
        relativePath: `${attachmentsDirectoryName}/${request.file.filename}`,
        mimeType: request.file.mimetype,
        byteSize: request.file.size,
        uploadedByUser,
      },
    })

    response.status(201).json({
      id: attachment.id,
      ownerType: attachment.ownerType,
      ownerId: attachment.ownerId,
      purpose: attachment.purpose,
      originalName: attachment.originalName,
      relativePath: attachment.relativePath,
      byteSize: attachment.byteSize,
      mimeType: attachment.mimeType,
      url: `/attachments/${attachment.storedFileName}`,
      createdAt: attachment.createdAt,
    })
  } catch (error) {
    await unlink(request.file.path).catch(() => {})
    next(error)
  }
})

router.get('/', async (_request, response, next) => {
  if (!databaseConfigured(response)) {
    return
  }

  try {
    const attachments = await prisma.attachment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    response.json(attachments)
  } catch (error) {
    next(error)
  }
})

export { router as attachmentsRouter }
