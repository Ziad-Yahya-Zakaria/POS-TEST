import { Router } from 'express'
import { branchPerformance, dashboardAlerts, dashboardMetrics, quickLinks } from '../../src/data/dashboard.js'
import { asyncHandler } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (_request, response) => {
    if (!process.env.DATABASE_URL) {
      response.json({
        metrics: dashboardMetrics,
        branches: branchPerformance,
        alerts: dashboardAlerts,
        quickLinks,
        source: 'mock',
      })
      return
    }

    const [branches, employeesCount, usersCount, productsCount, headOfficeCount] = await Promise.all([
      prisma.branch.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          employees: true,
          users: true,
          products: true,
        },
      }),
      prisma.employee.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.branch.count({
        where: { isHeadOffice: true },
      }),
    ])

    const activeBranches = branches.length
    const totalEmployeesAssigned = branches.reduce((sum, branch) => sum + branch.employees.length, 0)

    const metrics = [
      {
        label: 'الفروع النشطة',
        value: String(activeBranches),
        delta: headOfficeCount > 0 ? `منها ${headOfficeCount} فرع رئيسي` : 'بدون فرع رئيسي',
        tone: activeBranches > 0 ? 'success' : 'warning',
      },
      {
        label: 'الموظفون',
        value: String(employeesCount),
        delta: totalEmployeesAssigned > 0 ? 'مرتبطون بفروع فعلية' : 'لم يتم الربط بعد',
        tone: employeesCount > 0 ? 'info' : 'warning',
      },
      {
        label: 'المستخدمون',
        value: String(usersCount),
        delta: usersCount > 0 ? 'جاهزون للدخول' : 'لا توجد حسابات',
        tone: usersCount > 0 ? 'success' : 'warning',
      },
      {
        label: 'الأصناف',
        value: String(productsCount),
        delta: productsCount > 0 ? 'أصناف قابلة للبيع' : 'الكاتالوج لم يبدأ بعد',
        tone: productsCount > 0 ? 'neutral' : 'warning',
      },
    ]

    const branchCards = branches.slice(0, 6).map((branch, index) => {
      const coverageBase = branch.users.length * 20 + branch.employees.length * 8 + branch.products.length * 2
      const revenue = Math.max(18, Math.min(100, coverageBase || 22 + index * 6))

      return {
        name: branch.name,
        revenue,
        target: `${branch.users.length} مستخدم / ${branch.employees.length} موظف`,
        manager: branch.isHeadOffice ? 'فرع رئيسي' : branch.address || 'فرع تابع',
      }
    })

    const alerts = []

    if (usersCount === 0) {
      alerts.push({
        title: 'لا توجد حسابات مستخدمين',
        note: 'نفذ db:seed أو أضف مستخدمين من إعدادات الموظفين',
        tone: 'warning',
      })
    }

    if (activeBranches === 0) {
      alerts.push({
        title: 'لم يتم تعريف أي فرع',
        note: 'ابدأ من شاشة إعدادات الفرع',
        tone: 'danger',
      })
    }

    if (employeesCount > 0 && usersCount < employeesCount) {
      alerts.push({
        title: 'بعض الموظفين بدون حسابات دخول',
        note: `${employeesCount - usersCount} موظف يحتاج ربط مستخدم`,
        tone: 'info',
      })
    }

    if (alerts.length === 0) {
      alerts.push({
        title: 'البيانات الأساسية جاهزة',
        note: 'يمكنك الانتقال الآن لربط المبيعات والمنتجات',
        tone: 'success',
      })
    }

    response.json({
      metrics,
      branches: branchCards,
      alerts,
      quickLinks,
      source: 'sqlserver',
    })
  }),
)

export { router as dashboardRouter }
