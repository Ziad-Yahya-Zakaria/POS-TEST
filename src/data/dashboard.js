export const dashboardMetrics = [
  { label: 'إيراد اليوم', value: 'EGP 48,320', delta: '+12% عن أمس', tone: 'success' },
  { label: 'الفواتير المفتوحة', value: '18', delta: '4 فواتير معلقة', tone: 'info' },
  { label: 'طلبات الشراء', value: '7', delta: '3 بانتظار الاعتماد', tone: 'warning' },
  { label: 'الموظفون على الشفت', value: '26', delta: 'فرعان يعملان الآن', tone: 'neutral' },
]

export const branchPerformance = [
  { name: 'فرع المعادي', revenue: 92, target: 'EGP 18,400', manager: 'أحمد شريف' },
  { name: 'فرع مدينة نصر', revenue: 78, target: 'EGP 15,100', manager: 'سارة ياسين' },
  { name: 'فرع الشيخ زايد', revenue: 66, target: 'EGP 12,700', manager: 'محمد نادر' },
  { name: 'التجارة الإلكترونية', revenue: 84, target: 'EGP 16,800', manager: 'فريق الويب' },
]

export const dashboardAlerts = [
  { title: 'نفاد مخزون صنف قهوة مختصة', note: 'المتبقي 9 وحدات فقط', tone: 'warning' },
  { title: 'مورد جديد بانتظار التفعيل', note: 'شركة النور للتوريدات', tone: 'info' },
  { title: 'مراجعة تسوية خزنة فرع المعادي', note: 'فرق بسيط EGP 85', tone: 'danger' },
]

export const quickLinks = [
  { path: '/sales', title: 'بيع جديد', summary: 'فتح فاتورة بسرعة للكاشير.' },
  { path: '/purchase-request', title: 'طلب شراء', summary: 'رفع احتياج فوري للمخزن.' },
  { path: '/reports', title: 'تقارير اليوم', summary: 'مقارنة البيع والمرتجعات.' },
  { path: '/support', title: 'الدعم الفني', summary: 'إرسال مشكلة أو متابعة تذكرة.' },
]
