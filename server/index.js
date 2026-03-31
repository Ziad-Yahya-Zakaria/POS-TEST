import cors from 'cors'
import express from 'express'
import { moduleConfigs } from '../src/data/moduleConfigs.js'
import { allNavigationItems, navigationGroups } from '../src/data/navigation.js'
import { aboutHighlights, supportChannels, supportTickets } from '../src/data/setup.js'
import { attachmentsDirectory, attachmentsDirectoryName, ensureStorageDirectories } from './config/paths.js'
import { prisma } from './lib/prisma.js'
import { attachmentsRouter } from './routes/attachments.js'
import { authRouter } from './routes/auth.js'
import { branchesRouter } from './routes/branches.js'
import { customersRouter } from './routes/customers.js'
import { dashboardRouter } from './routes/dashboard.js'
import { employeesRouter } from './routes/employees.js'
import { productCategoriesRouter } from './routes/productCategories.js'
import { productsRouter } from './routes/products.js'
import { rolesRouter } from './routes/roles.js'
import { salesRouter } from './routes/sales.js'
import { suppliersRouter } from './routes/suppliers.js'
import { usersRouter } from './routes/users.js'

const app = express()
const port = Number.parseInt(process.env.PORT ?? '3001', 10)

ensureStorageDirectories()

app.use(cors())
app.use(express.json())
app.use('/attachments', express.static(attachmentsDirectory))

app.get('/api/health', async (_request, response) => {
  let databaseStatus = 'not-configured'
  let databaseError = null

  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRawUnsafe('SELECT 1 AS result')
      databaseStatus = 'up'
    } catch (error) {
      databaseStatus = 'down'
      databaseError = error instanceof Error ? error.message : 'Unknown error'
    }
  }

  response.status(databaseStatus === 'down' ? 503 : 200).json({
    status: databaseStatus === 'down' ? 'degraded' : 'ok',
    service: 'nawa-pos-api',
    date: new Date().toISOString(),
    database: {
      provider: 'sqlserver',
      status: databaseStatus,
      error: databaseError,
    },
    storage: {
      mode: 'filesystem',
      directoryName: attachmentsDirectoryName,
      absolutePath: attachmentsDirectory,
    },
  })
})

app.get('/api/navigation', (_request, response) => {
  response.json({
    groups: navigationGroups,
    items: allNavigationItems,
  })
})

app.get('/api/modules/:key', (request, response) => {
  const moduleConfig = moduleConfigs[request.params.key]

  if (!moduleConfig) {
    response.status(404).json({ message: 'Module not found.' })
    return
  }

  response.json(moduleConfig)
})

app.get('/api/support', (_request, response) => {
  response.json({
    channels: supportChannels,
    tickets: supportTickets,
  })
})

app.get('/api/about', (_request, response) => {
  response.json({
    highlights: aboutHighlights,
  })
})

app.use('/api/auth', authRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/branches', branchesRouter)
app.use('/api/employees', employeesRouter)
app.use('/api/users', usersRouter)
app.use('/api/product-categories', productCategoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/customers', customersRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/sales', salesRouter)
app.use('/api/attachments', attachmentsRouter)

app.use((error, _request, response, next) => {
  void next
  console.error(error)

  response.status(500).json({
    message: error instanceof Error ? error.message : 'Unexpected server error.',
  })
})

app.listen(port, () => {
  console.log(`Nawa POS API listening on http://localhost:${port}`)
  console.log(`SQL Server provider configured via DATABASE_URL`)
  console.log(`Attachments storage directory: ${attachmentsDirectory}`)
})
