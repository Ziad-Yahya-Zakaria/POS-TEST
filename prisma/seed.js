import { prisma } from '../server/lib/prisma.js'
import { hashPassword } from '../server/lib/auth.js'

async function main() {
  const [adminRole, cashierRole, supervisorRole, accountantRole] = await Promise.all([
    prisma.role.upsert({
      where: { code: 'ADMIN' },
      update: { name: 'مدير النظام', description: 'صلاحية كاملة على النظام' },
      create: { code: 'ADMIN', name: 'مدير النظام', description: 'صلاحية كاملة على النظام' },
    }),
    prisma.role.upsert({
      where: { code: 'CASHIER' },
      update: { name: 'كاشير', description: 'بيع وفواتير ومرتجعات عملاء' },
      create: { code: 'CASHIER', name: 'كاشير', description: 'بيع وفواتير ومرتجعات عملاء' },
    }),
    prisma.role.upsert({
      where: { code: 'SUPERVISOR' },
      update: { name: 'مشرف فرع', description: 'متابعة الشفتات والاعتمادات' },
      create: { code: 'SUPERVISOR', name: 'مشرف فرع', description: 'متابعة الشفتات والاعتمادات' },
    }),
    prisma.role.upsert({
      where: { code: 'ACCOUNTANT' },
      update: { name: 'محاسب', description: 'حركات مالية وتقارير' },
      create: { code: 'ACCOUNTANT', name: 'محاسب', description: 'حركات مالية وتقارير' },
    }),
  ])

  const headOffice = await prisma.branch.upsert({
    where: { code: 'HQ' },
    update: {
      name: 'الفرع الرئيسي',
      phone: '01005550022',
      address: 'القاهرة - المعادي',
      isHeadOffice: true,
    },
    create: {
      code: 'HQ',
      name: 'الفرع الرئيسي',
      phone: '01005550022',
      address: 'القاهرة - المعادي',
      isHeadOffice: true,
    },
  })

  const [adminEmployee, cashierEmployee] = await Promise.all([
    prisma.employee.upsert({
      where: { employeeCode: 'EMP-0001' },
      update: {
        firstName: 'نورا',
        lastName: 'محمود',
        phone: '01010010010',
        status: 'ACTIVE',
        nfcCardCode: 'ADMIN-0001',
        branchId: headOffice.id,
      },
      create: {
        employeeCode: 'EMP-0001',
        firstName: 'نورا',
        lastName: 'محمود',
        phone: '01010010010',
        status: 'ACTIVE',
        nfcCardCode: 'ADMIN-0001',
        branchId: headOffice.id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeCode: 'EMP-0002' },
      update: {
        firstName: 'عمر',
        lastName: 'سامي',
        phone: '01020020020',
        status: 'ACTIVE',
        nfcCardCode: 'CARD-0148',
        branchId: headOffice.id,
      },
      create: {
        employeeCode: 'EMP-0002',
        firstName: 'عمر',
        lastName: 'سامي',
        phone: '01020020020',
        status: 'ACTIVE',
        nfcCardCode: 'CARD-0148',
        branchId: headOffice.id,
      },
    }),
  ])

  const [adminHash, cashierHash] = await Promise.all([
    hashPassword('Admin@123'),
    hashPassword('123456'),
  ])

  await Promise.all([
    prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        passwordHash: adminHash,
        displayName: 'مدير النظام',
        status: 'ACTIVE',
        roleId: adminRole.id,
        branchId: headOffice.id,
        employeeId: adminEmployee.id,
      },
      create: {
        username: 'admin',
        passwordHash: adminHash,
        displayName: 'مدير النظام',
        status: 'ACTIVE',
        roleId: adminRole.id,
        branchId: headOffice.id,
        employeeId: adminEmployee.id,
      },
    }),
    prisma.user.upsert({
      where: { username: 'cashier01' },
      update: {
        passwordHash: cashierHash,
        displayName: 'عمر سامي',
        status: 'ACTIVE',
        roleId: cashierRole.id,
        branchId: headOffice.id,
        employeeId: cashierEmployee.id,
      },
      create: {
        username: 'cashier01',
        passwordHash: cashierHash,
        displayName: 'عمر سامي',
        status: 'ACTIVE',
        roleId: cashierRole.id,
        branchId: headOffice.id,
        employeeId: cashierEmployee.id,
      },
    }),
  ])

  const [beveragesCategory, bakeryCategory] = await Promise.all([
    prisma.productCategory.upsert({
      where: { code: 'BEV' },
      update: {
        name: 'مشروبات',
        description: 'المشروبات الساخنة والباردة',
      },
      create: {
        code: 'BEV',
        name: 'مشروبات',
        description: 'المشروبات الساخنة والباردة',
      },
    }),
    prisma.productCategory.upsert({
      where: { code: 'BAKERY' },
      update: {
        name: 'مخبوزات',
        description: 'المخبوزات والحلويات السريعة',
      },
      create: {
        code: 'BAKERY',
        name: 'مخبوزات',
        description: 'المخبوزات والحلويات السريعة',
      },
    }),
  ])

  await Promise.all([
    prisma.product.upsert({
      where: { sku: 'BEV-001' },
      update: {
        name: 'قهوة تركي',
        salePrice: 38,
        costPrice: 21,
        stockOnHand: 84,
        reorderLevel: 20,
        branchId: headOffice.id,
        categoryId: beveragesCategory.id,
      },
      create: {
        sku: 'BEV-001',
        name: 'قهوة تركي',
        barcode: '622100100001',
        salePrice: 38,
        costPrice: 21,
        stockOnHand: 84,
        reorderLevel: 20,
        unitName: 'كوب',
        branchId: headOffice.id,
        categoryId: beveragesCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'BEV-002' },
      update: {
        name: 'كابتشينو',
        salePrice: 52,
        costPrice: 29,
        stockOnHand: 64,
        reorderLevel: 18,
        branchId: headOffice.id,
        categoryId: beveragesCategory.id,
      },
      create: {
        sku: 'BEV-002',
        name: 'كابتشينو',
        barcode: '622100100002',
        salePrice: 52,
        costPrice: 29,
        stockOnHand: 64,
        reorderLevel: 18,
        unitName: 'كوب',
        branchId: headOffice.id,
        categoryId: beveragesCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'BAK-001' },
      update: {
        name: 'كرواسون زبدة',
        salePrice: 29,
        costPrice: 14,
        stockOnHand: 31,
        reorderLevel: 10,
        branchId: headOffice.id,
        categoryId: bakeryCategory.id,
      },
      create: {
        sku: 'BAK-001',
        name: 'كرواسون زبدة',
        barcode: '622100100003',
        salePrice: 29,
        costPrice: 14,
        stockOnHand: 31,
        reorderLevel: 10,
        unitName: 'قطعة',
        branchId: headOffice.id,
        categoryId: bakeryCategory.id,
      },
    }),
  ])

  await Promise.all([
    prisma.customer.upsert({
      where: { code: 'CUS-001' },
      update: {
        name: 'عميل نقدي',
        phone: '01001122334',
        creditLimit: 0,
      },
      create: {
        code: 'CUS-001',
        name: 'عميل نقدي',
        phone: '01001122334',
        creditLimit: 0,
      },
    }),
    prisma.customer.upsert({
      where: { code: 'CUS-002' },
      update: {
        name: 'مي أحمد',
        phone: '01005550111',
        address: 'القاهرة',
        creditLimit: 500,
      },
      create: {
        code: 'CUS-002',
        name: 'مي أحمد',
        phone: '01005550111',
        address: 'القاهرة',
        creditLimit: 500,
      },
    }),
  ])

  await Promise.all([
    prisma.supplier.upsert({
      where: { code: 'SUP-001' },
      update: {
        name: 'شركة النور',
        phone: '01003334444',
        paymentTerms: '30 يوم',
        taxNumber: '312-55-9187',
      },
      create: {
        code: 'SUP-001',
        name: 'شركة النور',
        phone: '01003334444',
        paymentTerms: '30 يوم',
        taxNumber: '312-55-9187',
      },
    }),
    prisma.supplier.upsert({
      where: { code: 'SUP-002' },
      update: {
        name: 'أوكسجين التجارية',
        phone: '01006667777',
        paymentTerms: 'نقدي',
      },
      create: {
        code: 'SUP-002',
        name: 'أوكسجين التجارية',
        phone: '01006667777',
        paymentTerms: 'نقدي',
      },
    }),
  ])

  console.log('Seed completed successfully.')
  console.log('Default users:')
  console.log('admin / Admin@123')
  console.log('cashier01 / 123456')
  console.log('NFC card: CARD-0148')

  void supervisorRole
  void accountantRole
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
