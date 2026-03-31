import cors from 'cors'
import express from 'express'
import { branchPerformance, dashboardAlerts, dashboardMetrics, quickLinks } from '../src/data/dashboard.js'
import { moduleConfigs } from '../src/data/moduleConfigs.js'
import { allNavigationItems, navigationGroups } from '../src/data/navigation.js'
import { aboutHighlights, supportChannels, supportTickets } from '../src/data/setup.js'

const app = express()
const port = Number.parseInt(process.env.PORT ?? '3001', 10)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'nawa-pos-api',
    date: new Date().toISOString(),
  })
})

app.post('/api/login', (request, response) => {
  const { method = 'user', username = 'cashier01' } = request.body ?? {}

  response.json({
    success: true,
    user: {
      name: 'نورا محمود',
      role: 'مدير تشغيل',
      loginMethod: method,
      username,
    },
  })
})

app.get('/api/navigation', (_request, response) => {
  response.json({
    groups: navigationGroups,
    items: allNavigationItems,
  })
})

app.get('/api/dashboard', (_request, response) => {
  response.json({
    metrics: dashboardMetrics,
    branches: branchPerformance,
    alerts: dashboardAlerts,
    quickLinks,
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

app.listen(port, () => {
  console.log(`Nawa POS API listening on http://localhost:${port}`)
})
