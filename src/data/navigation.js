export const navigationGroups = [
  {
    title: 'الواجهة الرئيسية',
    items: [
      { path: '/dashboard', label: 'داشبورد', hint: 'المؤشرات والتنبيهات' },
      { path: '/sales', label: 'صفحة البيع', hint: 'نقطة البيع والكاشير' },
      { path: '/invoice-designer', label: 'شكل الفاتورة', hint: 'تصميم وطباعة الفاتورة' },
    ],
  },
  {
    title: 'المشتريات والحركة',
    items: [
      { path: '/purchases', label: 'المشتريات', hint: 'طلبات التوريد والاستلام' },
      { path: '/purchase-request', label: 'طلب شراء', hint: 'إدخال الاحتياجات' },
      { path: '/purchase-confirmation', label: 'تأكيد طلب الشراء', hint: 'اعتماد الطلبات' },
      { path: '/purchase-returns', label: 'مرتجعات المشتريات', hint: 'إرجاع للموردين' },
      { path: '/customer-returns', label: 'مرتجعات العملاء', hint: 'إرجاع مبيعات' },
    ],
  },
  {
    title: 'الإدارة والتحكم',
    items: [
      { path: '/finance', label: 'المالية', hint: 'الخزائن والحسابات' },
      { path: '/reports', label: 'التقارير', hint: 'تقارير التشغيل والربحية' },
      { path: '/employees', label: 'الموظفين', hint: 'الدوام والصلاحيات' },
      { path: '/integration', label: 'التكامل', hint: 'الدفع والربط الخارجي' },
      { path: '/support', label: 'صفحة الدعم الفني', hint: 'التذاكر والمتابعة' },
      { path: '/about', label: 'صفحة عن البرنامج', hint: 'الوحدات والإصدار' },
    ],
  },
  {
    title: 'الإعدادات',
    items: [
      { path: '/business-settings', label: 'إعدادات النشاط التجاري', hint: 'بيانات المنشأة والضرائب' },
      { path: '/employee-settings', label: 'إعدادات الموظفين', hint: 'الأدوار والسياسات' },
      { path: '/product-settings', label: 'إعدادات المنتجات', hint: 'الأصناف والباركود' },
      { path: '/program-settings', label: 'إعدادات البرنامج', hint: 'النسخ الاحتياطي واللغة' },
      { path: '/branch-settings', label: 'إعدادات الفرع', hint: 'الفروع والمخازن' },
      { path: '/offer-settings', label: 'إعدادات العروض', hint: 'العروض الذكية والحزم' },
      { path: '/customer-settings', label: 'إعدادات العملاء', hint: 'الشرائح والولاء' },
      { path: '/supplier-settings', label: 'إعدادات الموردين', hint: 'العقود والاعتمادات' },
      { path: '/business-type', label: 'نوع النشاط التجاري', hint: 'اختيار المجال والبيانات المطلوبة' },
    ],
  },
]

export const allNavigationItems = navigationGroups.flatMap((group) => group.items)
