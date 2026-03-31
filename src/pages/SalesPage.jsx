import { useEffect, useState } from 'react'
import { Badge, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'
import { readSession } from '../lib/session.js'

function formatCurrency(value) {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function roundAmount(value) {
  return Number(value.toFixed(2))
}

function normalizePaymentMethod(value) {
  const rawValue = String(value ?? '').trim().toUpperCase()

  if (rawValue === 'CARD' || rawValue === 'بطاقة') {
    return 'CARD'
  }

  if (rawValue === 'WALLET' || rawValue === 'محفظة رقمية') {
    return 'WALLET'
  }

  return 'CASH'
}

function paymentMethodLabel(value) {
  const normalized = normalizePaymentMethod(value)

  if (normalized === 'CARD') {
    return 'بطاقة'
  }

  if (normalized === 'WALLET') {
    return 'محفظة رقمية'
  }

  return 'نقدي'
}

function normalizeSuggestedCart(items, products) {
  const productMap = new Map(products.map((product) => [String(product.id), product]))

  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const productId = String(item.productId ?? item.id)
      const product = productMap.get(productId)
      const maxStock = Number(product?.stockOnHand ?? item.maxStock ?? 0)

      return {
        productId,
        name: product?.name ?? item.name ?? 'صنف',
        price: Number(item.price ?? item.salePrice ?? product?.salePrice ?? 0),
        quantity: Number(item.qty ?? item.quantity ?? 1),
        maxStock,
      }
    })
    .filter((item) => item.quantity > 0 && item.maxStock > 0)
}

export function SalesPage() {
  const session = readSession()
  const currentUser = session?.user ?? null
  const [state, setState] = useState({
    categories: ['الكل'],
    products: [],
    customers: [],
    paymentMethods: ['CASH'],
    source: null,
    loading: true,
    error: null,
  })
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [cart, setCart] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CASH')
  const [note, setNote] = useState('')
  const [notice, setNotice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadSalesBootstrap() {
      try {
        const data = await fetchJson('/api/sales/bootstrap')

        if (cancelled) {
          return
        }

        const categories =
          Array.isArray(data.categories) && data.categories.length > 0
            ? data.categories
            : ['الكل']
        const products = Array.isArray(data.products) ? data.products : []
        const customers = Array.isArray(data.customers) ? data.customers : []
        const paymentMethods =
          Array.isArray(data.paymentMethods) && data.paymentMethods.length > 0
            ? data.paymentMethods
            : ['CASH']

        setState({
          categories,
          products,
          customers,
          paymentMethods,
          source: data.source ?? null,
          loading: false,
          error: null,
        })
        setActiveCategory(categories[0] ?? 'الكل')
        setSelectedCustomerId((current) => current || customers[0]?.id || '')
        setSelectedPaymentMethod(normalizePaymentMethod(paymentMethods[0]))
        setCart((current) =>
          current.length > 0 ? current : normalizeSuggestedCart(data.suggestedCart, products),
        )
      } catch (error) {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : 'تعذر تحميل شاشة البيع.',
          }))
        }
      }
    }

    void loadSalesBootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  const products =
    activeCategory === 'الكل'
      ? state.products
      : state.products.filter((item) => item.categoryName === activeCategory)
  const selectedCustomer =
    state.customers.find((customer) => customer.id === selectedCustomerId) ?? null
  const subtotal = roundAmount(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const discount = subtotal > 180 ? 15 : 0
  const tax = roundAmount((subtotal - discount) * 0.14)
  const total = roundAmount(subtotal - discount + tax)

  function addToCart(product) {
    const availableStock = Number(product.stockOnHand ?? 0)

    if (!product.isActive || availableStock <= 0 || isSubmitting) {
      return
    }

    setCart((current) => {
      const existing = current.find((item) => item.productId === String(product.id))

      if (!existing) {
        return [
          ...current,
          {
            productId: String(product.id),
            name: product.name,
            price: Number(product.salePrice),
            quantity: 1,
            maxStock: availableStock,
          },
        ]
      }

      return current.map((item) =>
        item.productId === String(product.id)
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, availableStock),
              maxStock: availableStock,
            }
          : item,
      )
    })
  }

  function updateQty(productId, step) {
    if (isSubmitting) {
      return
    }

    setCart((current) =>
      current
        .map((item) => {
          if (item.productId !== productId) {
            return item
          }

          const nextQuantity = Math.max(0, Math.min(item.quantity + step, item.maxStock))
          return {
            ...item,
            quantity: nextQuantity,
          }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  async function handleCheckout() {
    setNotice(null)

    if (state.source !== 'sqlserver') {
      setNotice({
        tone: 'error',
        title: 'وضع تجريبي فقط',
        message: 'إتمام البيع الحقيقي متاح بعد ضبط SQL Server وتشغيل db:push و db:seed.',
      })
      return
    }

    if (!currentUser?.branch?.id) {
      setNotice({
        tone: 'error',
        title: 'الفرع غير متاح',
        message: 'يجب تسجيل الدخول بحساب مربوط بفرع قبل إتمام البيع.',
      })
      return
    }

    if (cart.length === 0) {
      setNotice({
        tone: 'error',
        title: 'السلة فارغة',
        message: 'أضف صنفاً واحداً على الأقل قبل إتمام البيع.',
      })
      return
    }

    const cartSnapshot = cart.map((item) => ({ ...item }))
    setIsSubmitting(true)

    try {
      const data = await fetchJson('/api/sales/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branchId: currentUser.branch.id,
          customerId: selectedCustomerId || null,
          createdByUserId: currentUser.id,
          paymentMethod: selectedPaymentMethod,
          note: note.trim() || null,
          discount,
          tax,
          items: cartSnapshot.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      })

      setState((current) => ({
        ...current,
        products: current.products.map((product) => {
          const soldItem = cartSnapshot.find((item) => item.productId === String(product.id))

          if (!soldItem) {
            return product
          }

          return {
            ...product,
            stockOnHand: roundAmount(Math.max(0, Number(product.stockOnHand) - soldItem.quantity)),
          }
        }),
      }))
      setCart([])
      setNote('')
      setNotice({
        tone: 'success',
        title: 'تم حفظ الفاتورة',
        message: `تم إصدار الفاتورة ${data.invoice.invoiceNumber} بقيمة ${formatCurrency(data.invoice.total)}.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر إتمام البيع',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء حفظ الفاتورة.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="نقطة البيع"
        title="صفحة البيع"
        description="واجهة كاشير مرتبطة بمنتجات وعملاء وفواتير فعلية. عند العمل على SQL Server سيتم حفظ الفاتورة وتخفيض المخزون مباشرة."
        actions={['عميل جديد', 'تعليق الفاتورة', 'إعادة طباعة']}
      />

      {state.source ? (
        <div className="inline-status">
          <Badge tone={state.source === 'sqlserver' ? 'success' : 'warning'}>
            المصدر: {state.source === 'sqlserver' ? 'SQL Server' : 'Mock Data'}
          </Badge>
        </div>
      ) : null}

      {state.error ? (
        <div className="notice-card notice-card-error">
          <strong>تعذر تحميل شاشة البيع</strong>
          <p>{state.error}</p>
        </div>
      ) : null}

      {notice ? (
        <div className={`notice-card ${notice.tone === 'error' ? 'notice-card-error' : 'notice-card-success'}`}>
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
        </div>
      ) : null}

      <div className="sales-layout">
        <Panel
          title="الأصناف"
          subtitle={
            state.loading
              ? 'جارٍ تحميل المنتجات...'
              : 'اختر الفئة ثم أضف الأصناف المتاحة مباشرة إلى الفاتورة.'
          }
        >
          <div className="category-strip">
            {state.categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'chip-button chip-button-active' : 'chip-button'}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {products.length === 0 ? (
              <div className="notice-card">
                <strong>لا توجد أصناف جاهزة</strong>
                <p>أضف المنتجات من إعدادات المنتجات أو شغّل قاعدة البيانات لتحميل الكاتالوج الفعلي.</p>
              </div>
            ) : (
              products.map((product) => {
                const stockOnHand = Number(product.stockOnHand ?? 0)
                const disabled = !product.isActive || stockOnHand <= 0 || isSubmitting

                return (
                  <button
                    key={product.id}
                    className="product-card"
                    disabled={disabled}
                    type="button"
                    onClick={() => addToCart(product)}
                  >
                    <div className="product-topline">
                      <Badge tone={!product.isActive || stockOnHand <= 0 ? 'warning' : 'info'}>
                        {product.tag || (!product.isActive || stockOnHand <= 0 ? 'غير متاح' : 'جاهز')}
                      </Badge>
                      <span className="product-stock">المخزون {stockOnHand}</span>
                    </div>
                    <strong className="product-name">{product.name}</strong>
                    <p className="product-category">{product.categoryName}</p>
                    <div className="product-footer">
                      <span className="product-price">{formatCurrency(product.salePrice)}</span>
                      <span className="product-add">
                        {!product.isActive || stockOnHand <= 0 ? 'نفد' : 'إضافة'}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </Panel>

        <div className="content-column">
          <Panel
            title="سلة الفاتورة"
            subtitle={`العميل: ${selectedCustomer?.name || 'عميل نقدي / بدون عميل'} - الفرع: ${currentUser?.branch?.name || 'غير محدد'}`}
          >
            <div className="cart-list">
              {cart.length === 0 ? (
                <div className="notice-card">
                  <strong>السلة فارغة</strong>
                  <p>أضف أصنافاً من الكاتالوج الموجود على اليمين ثم أكمل عملية البيع.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="cart-line">
                    <div>
                      <strong className="stack-item-title">{item.name}</strong>
                      <p className="stack-item-note">
                        {formatCurrency(item.price)} للوحدة - متاح {item.maxStock}
                      </p>
                    </div>
                    <div className="qty-stepper">
                      <button type="button" onClick={() => updateQty(item.productId, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQty(item.productId, 1)}>
                        +
                      </button>
                    </div>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                ))
              )}
            </div>

            <div className="amount-list">
              <span>الإجمالي الفرعي</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="amount-list">
              <span>الخصم</span>
              <strong>{formatCurrency(discount)}</strong>
            </div>
            <div className="amount-list">
              <span>الضريبة</span>
              <strong>{formatCurrency(tax)}</strong>
            </div>
            <div className="amount-list amount-total">
              <span>الإجمالي النهائي</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <div className="checkout-actions">
              <button
                className="primary-button primary-button-wide"
                disabled={
                  isSubmitting ||
                  cart.length === 0 ||
                  state.loading ||
                  state.source !== 'sqlserver' ||
                  !currentUser?.branch?.id
                }
                type="button"
                onClick={handleCheckout}
              >
                {isSubmitting ? 'جارٍ حفظ الفاتورة...' : 'إتمام البيع'}
              </button>
              <button
                className="ghost-button primary-button-wide"
                disabled={isSubmitting || cart.length === 0}
                type="button"
                onClick={() => setCart([])}
              >
                مسح السلة
              </button>
            </div>
          </Panel>

          <Panel title="العميل والدفع" subtitle="اختيار العميل وطريقة الدفع قبل إصدار الفاتورة.">
            <div className="form-stack">
              <label className="field-row">
                <span>العميل</span>
                <select
                  className="field-input"
                  value={selectedCustomerId}
                  onChange={(event) => setSelectedCustomerId(event.target.value)}
                >
                  <option value="">عميل نقدي / بدون عميل</option>
                  {state.customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-row">
                <span>ملاحظات الفاتورة</span>
                <input
                  className="field-input"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="مثال: طلب سفري / ملاحظة للكاشير"
                />
              </label>

              <div className="field-row">
                <span>طريقة الدفع</span>
                <div className="category-strip">
                  {state.paymentMethods.map((method) => {
                    const normalizedMethod = normalizePaymentMethod(method)

                    return (
                      <button
                        key={String(method)}
                        className={
                          selectedPaymentMethod === normalizedMethod
                            ? 'chip-button chip-button-active'
                            : 'chip-button'
                        }
                        type="button"
                        onClick={() => setSelectedPaymentMethod(normalizedMethod)}
                      >
                        {paymentMethodLabel(method)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="payment-grid">
              {state.paymentMethods.map((method) => {
                const normalizedMethod = normalizePaymentMethod(method)
                const isActive = selectedPaymentMethod === normalizedMethod

                return (
                  <article key={String(method)} className="payment-card">
                    <Badge tone={isActive ? 'success' : 'neutral'}>
                      {paymentMethodLabel(method)}
                    </Badge>
                    <strong>{formatCurrency(isActive ? total : 0)}</strong>
                  </article>
                )
              })}
            </div>

            {selectedCustomer ? (
              <div className="notice-card">
                <strong>{selectedCustomer.name}</strong>
                <p>
                  {selectedCustomer.phone || 'بدون هاتف'} -{' '}
                  {selectedCustomer.address || 'بدون عنوان محفوظ'}
                </p>
              </div>
            ) : null}

            {state.source !== 'sqlserver' ? (
              <div className="notice-card">
                <strong>وضع عرض فقط</strong>
                <p>
                  الكاتالوج الحالي يعمل ببيانات محلية. بعد ربط `DATABASE_URL` وتشغيل `db:push`
                  و`db:seed` سيتاح حفظ البيع الحقيقي.
                </p>
              </div>
            ) : null}
          </Panel>
        </div>
      </div>
    </div>
  )
}
