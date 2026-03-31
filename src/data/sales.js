export const salesCatalog = [
  { id: 1, name: 'قهوة تركي', category: 'مشروبات', price: 38, stock: 84, tag: 'سريع' },
  { id: 2, name: 'كابتشينو', category: 'مشروبات', price: 52, stock: 64, tag: 'الأكثر مبيعاً' },
  { id: 3, name: 'ساندويتش حلومي', category: 'وجبات', price: 74, stock: 22, tag: 'طازج' },
  { id: 4, name: 'كرواسون زبدة', category: 'مخبوزات', price: 29, stock: 31, tag: 'صباحي' },
  { id: 5, name: 'كيكة تمر', category: 'حلويات', price: 41, stock: 18, tag: 'مميز' },
  { id: 6, name: 'مياه معدنية', category: 'مشروبات', price: 12, stock: 120, tag: 'مخزن' },
  { id: 7, name: 'سلطة سيزر', category: 'وجبات', price: 88, stock: 15, tag: 'خفيف' },
  { id: 8, name: 'دونات شوكولاتة', category: 'حلويات', price: 33, stock: 26, tag: 'عرض' },
]

export const initialCart = [
  { id: 2, name: 'كابتشينو', price: 52, qty: 2 },
  { id: 4, name: 'كرواسون زبدة', price: 29, qty: 1 },
  { id: 8, name: 'دونات شوكولاتة', price: 33, qty: 1 },
]

export const paymentBreakdown = [
  { label: 'نقدي', value: 'EGP 96', tone: 'neutral' },
  { label: 'بطاقة', value: 'EGP 70', tone: 'success' },
  { label: 'محفظة رقمية', value: 'EGP 29', tone: 'info' },
]

export const invoiceSections = [
  { id: 'logo', label: 'إظهار الشعار', enabled: true },
  { id: 'tax', label: 'إظهار الرقم الضريبي', enabled: true },
  { id: 'cashier', label: 'إظهار اسم الكاشير', enabled: true },
  { id: 'qr', label: 'إظهار QR', enabled: true },
  { id: 'offers', label: 'إظهار العروض المطبقة', enabled: false },
]

export const invoiceItems = [
  { name: 'كابتشينو', qty: 2, total: 'EGP 104' },
  { name: 'كرواسون زبدة', qty: 1, total: 'EGP 29' },
  { name: 'دونات شوكولاتة', qty: 1, total: 'EGP 33' },
]
