import { Router } from 'express'
import { initialCart, salesCatalog } from '../../src/data/sales.js'
import { asyncHandler, databaseConfigured, requireFields } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'

const router = Router()

function buildInvoiceNumber() {
  const timestamp = new Date()
  const y = timestamp.getFullYear()
  const m = String(timestamp.getMonth() + 1).padStart(2, '0')
  const d = String(timestamp.getDate()).padStart(2, '0')
  const t = String(timestamp.getHours()).padStart(2, '0') + String(timestamp.getMinutes()).padStart(2, '0') + String(timestamp.getSeconds()).padStart(2, '0')
  const ms = String(timestamp.getMilliseconds()).padStart(3, '0')
  const randomSuffix = Math.random().toString(36).slice(2, 4).toUpperCase()

  return `POS-${y}${m}${d}-${t}${ms}-${randomSuffix}`
}

router.get(
  '/bootstrap',
  asyncHandler(async (_request, response) => {
    if (!process.env.DATABASE_URL) {
      const categories = ['الكل', ...new Set(salesCatalog.map((item) => item.category))]
      const customers = [
        { id: 'walk-in', name: 'عميل نقدي', phone: null },
        { id: 'customer-demo', name: 'مي أحمد', phone: '01001122334' },
      ]

      response.json({
        categories,
        products: salesCatalog.map((item) => ({
          id: String(item.id),
          name: item.name,
          categoryName: item.category,
          salePrice: item.price,
          stockOnHand: item.stock,
          tag: item.tag,
          isActive: true,
        })),
        customers,
        paymentMethods: ['CASH', 'CARD', 'WALLET'],
        suggestedCart: initialCart,
        source: 'mock',
      })
      return
    }

    const [products, customers] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { name: 'asc' },
      }),
      prisma.customer.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        take: 50,
      }),
    ])

    const categories = ['الكل', ...new Set(products.map((item) => item.category.name))]

    response.json({
      categories,
      products: products.map((item) => ({
        id: item.id,
        name: item.name,
        categoryName: item.category.name,
        salePrice: Number(item.salePrice),
        stockOnHand: Number(item.stockOnHand),
        tag: item.barcode ? 'باركود' : 'مباشر',
        isActive: item.isActive,
      })),
      customers,
      paymentMethods: ['CASH', 'CARD', 'WALLET'],
      suggestedCart: [],
      source: 'sqlserver',
    })
  }),
)

router.post(
  '/checkout',
  asyncHandler(async (request, response) => {
    if (!databaseConfigured(response)) {
      return
    }

    const missingFields = requireFields(request.body, ['branchId', 'items', 'paymentMethod'])

    if (missingFields.length > 0) {
      response.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
      return
    }

    const items = Array.isArray(request.body.items) ? request.body.items : []

    if (items.length === 0) {
      response.status(400).json({ message: 'Invoice must contain at least one item.' })
      return
    }

    const branchId = String(request.body.branchId)
    const customerId = request.body.customerId ? String(request.body.customerId) : null
    const createdByUserId = request.body.createdByUserId ? String(request.body.createdByUserId) : null
    const paymentMethod = String(request.body.paymentMethod).trim().toUpperCase()
    const supportedPaymentMethods = new Set(['CASH', 'CARD', 'WALLET'])

    if (!supportedPaymentMethods.has(paymentMethod)) {
      response.status(400).json({ message: 'Unsupported payment method.' })
      return
    }

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { id: true },
    })

    if (!branch) {
      response.status(400).json({ message: 'Branch not found.' })
      return
    }

    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true, isActive: true },
      })

      if (!customer || !customer.isActive) {
        response.status(400).json({ message: 'Customer not found or inactive.' })
        return
      }
    }

    const productIds = items.map((item) => String(item.productId))
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        category: true,
      },
    })

    const productMap = new Map(products.map((product) => [product.id, product]))
    const normalizedItems = []

    for (const item of items) {
      const product = productMap.get(String(item.productId))

      if (!product) {
        response.status(400).json({ message: `Product not found: ${item.productId}` })
        return
      }

      const quantity = Number(item.quantity)

      if (!quantity || quantity <= 0) {
        response.status(400).json({ message: `Invalid quantity for product: ${product.name}` })
        return
      }

      if (!product.isActive) {
        response.status(400).json({ message: `Product is inactive: ${product.name}` })
        return
      }

      if (Number(product.stockOnHand) < quantity) {
        response.status(400).json({ message: `Insufficient stock for product: ${product.name}` })
        return
      }

      const unitPrice = Number(product.salePrice)
      const lineTotal = Number((unitPrice * quantity).toFixed(2))

      normalizedItems.push({
        product,
        quantity,
        unitPrice,
        lineTotal,
      })
    }

    const subtotal = Number(normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2))
    const discount = Number(request.body.discount ? Number(request.body.discount) : 0)
    const tax = Number(request.body.tax ? Number(request.body.tax) : Number(((subtotal - discount) * 0.14).toFixed(2)))
    const total = Number((subtotal - discount + tax).toFixed(2))
    const invoiceNumber = buildInvoiceNumber()

    if (discount < 0 || tax < 0 || total <= 0) {
      response.status(400).json({ message: 'Invoice totals are invalid.' })
      return
    }

    const invoice = await prisma.$transaction(async (transaction) => {
      const createdInvoice = await transaction.salesInvoice.create({
        data: {
          invoiceNumber,
          branchId,
          customerId,
          createdByUserId,
          subtotal,
          discount,
          tax,
          total,
          paymentMethod,
          status: 'COMPLETED',
          note: request.body.note ? String(request.body.note) : null,
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
          },
        },
        include: {
          items: true,
          customer: true,
          branch: true,
        },
      })

      await Promise.all(
        normalizedItems.map((item) =>
          transaction.product.update({
            where: { id: item.product.id },
            data: {
              stockOnHand: {
                decrement: item.quantity,
              },
            },
          }),
        ),
      )

      return createdInvoice
    })

    response.status(201).json({
      success: true,
      invoice,
    })
  }),
)

export { router as salesRouter }
