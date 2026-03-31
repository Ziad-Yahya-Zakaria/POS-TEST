import { useState } from 'react'
import { initialCart, paymentBreakdown, salesCatalog } from '../data/sales.js'
import { Badge, PageHeader, Panel } from '../components/PageBlocks.jsx'

function formatCurrency(value) {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function SalesPage() {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [cart, setCart] = useState(initialCart)
  const categories = ['الكل', ...new Set(salesCatalog.map((item) => item.category))]

  const products =
    activeCategory === 'الكل'
      ? salesCatalog
      : salesCatalog.filter((item) => item.category === activeCategory)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discount = subtotal > 180 ? 15 : 0
  const tax = Math.round((subtotal - discount) * 0.14)
  const total = subtotal - discount + tax

  function addToCart(product) {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id)

      if (!exists) {
        return [...current, { id: product.id, name: product.name, price: product.price, qty: 1 }]
      }

      return current.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
      )
    })
  }

  function updateQty(id, step) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + step) } : item,
        )
        .filter((item) => item.qty > 0),
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="نقطة البيع"
        title="صفحة البيع"
        description="واجهة كاشير سريعة لإضافة الأصناف، مراجعة السلة، وتحصيل المدفوعات من العميل."
        actions={['عميل جديد', 'تعليق الفاتورة', 'إعادة طباعة']}
      />

      <div className="sales-layout">
        <Panel title="الأصناف" subtitle="اختر الفئة ثم أضف الأصناف مباشرة إلى الفاتورة.">
          <div className="category-strip">
            {categories.map((category) => (
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
            {products.map((product) => (
              <button
                key={product.id}
                className="product-card"
                type="button"
                onClick={() => addToCart(product)}
              >
                <div className="product-topline">
                  <Badge tone="info">{product.tag}</Badge>
                  <span className="product-stock">المخزون {product.stock}</span>
                </div>
                <strong className="product-name">{product.name}</strong>
                <p className="product-category">{product.category}</p>
                <div className="product-footer">
                  <span className="product-price">{formatCurrency(product.price)}</span>
                  <span className="product-add">إضافة</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="content-column">
          <Panel title="سلة الفاتورة" subtitle="العميل: مي أحمد - الطاولة 3 / طلب سريع">
            <div className="cart-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-line">
                  <div>
                    <strong className="stack-item-title">{item.name}</strong>
                    <p className="stack-item-note">{formatCurrency(item.price)} للوحدة</p>
                  </div>
                  <div className="qty-stepper">
                    <button type="button" onClick={() => updateQty(item.id, -1)}>
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, 1)}>
                      +
                    </button>
                  </div>
                  <strong>{formatCurrency(item.price * item.qty)}</strong>
                </div>
              ))}
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
              <button className="primary-button primary-button-wide" type="button">
                إتمام البيع
              </button>
              <button className="ghost-button primary-button-wide" type="button">
                حفظ كفاتورة معلقة
              </button>
            </div>
          </Panel>

          <Panel title="طرق الدفع" subtitle="تقسيم سريع للمدفوعات المتاحة.">
            <div className="payment-grid">
              {paymentBreakdown.map((payment) => (
                <article key={payment.label} className="payment-card">
                  <Badge tone={payment.tone}>{payment.label}</Badge>
                  <strong>{payment.value}</strong>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
