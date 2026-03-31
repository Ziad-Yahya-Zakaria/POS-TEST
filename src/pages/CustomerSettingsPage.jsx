import { useEffect, useState } from 'react'
import { MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'

const initialCustomerForm = {
  code: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  creditLimit: '',
}

export function CustomerSettingsPage() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(initialCustomerForm)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadCustomers() {
      try {
        const data = await fetchJson('/api/customers')

        if (!cancelled) {
          setCustomers(data)
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            tone: 'error',
            title: 'تعذر تحميل العملاء',
            message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
          })
        }
      }
    }

    void loadCustomers()

    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(field) {
    return (event) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      const created = await fetchJson('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      setCustomers((current) => [created, ...current])
      setForm(initialCustomerForm)
      setNotice({
        tone: 'success',
        title: 'تم حفظ العميل',
        message: `تم إضافة العميل ${created.name}.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر حفظ العميل',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setSaving(false)
    }
  }

  const metrics = [
    { label: 'إجمالي العملاء', value: String(customers.length), delta: 'عملاء محفوظون في النظام', tone: customers.length > 0 ? 'success' : 'warning' },
    { label: 'عملاء بهاتف', value: String(customers.filter((item) => item.phone).length), delta: 'قابلون للتواصل', tone: 'info' },
    { label: 'عملاء بائتمان', value: String(customers.filter((item) => Number(item.creditLimit) > 0).length), delta: 'لهم سقف ائتماني', tone: 'warning' },
    { label: 'عملاء نشطون', value: String(customers.filter((item) => item.isActive).length), delta: 'جاهزون للبيع', tone: 'neutral' },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="العملاء والولاء"
        title="إعدادات العملاء"
        description="إدارة العملاء الفعليين الذين يمكن اختيارهم داخل شاشة البيع."
        actions={['عميل جديد']}
      />

      <MetricGrid items={metrics} />

      {notice ? (
        <div className={`notice-card ${notice.tone === 'error' ? 'notice-card-error' : 'notice-card-success'}`}>
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
        </div>
      ) : null}

      <div className="content-grid two-columns">
        <Panel title="العملاء الحاليون" subtitle="العملاء المحفوظون في قاعدة البيانات.">
          <div className="entity-list">
            {customers.map((customer) => (
              <article key={customer.id} className="entity-card">
                <div className="entity-topline">
                  <strong>{customer.name}</strong>
                  <span className="badge badge-info">{customer.code}</span>
                </div>
                <p>{customer.address || 'بدون عنوان'}</p>
                <div className="entity-meta">
                  <span>{customer.phone || 'بدون هاتف'}</span>
                  <span>{customer.email || 'بدون بريد'}</span>
                </div>
                <div className="entity-meta">
                  <span>ائتمان: {Number(customer.creditLimit)} EGP</span>
                  <span>{customer.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="إضافة عميل" subtitle="إنشاء عميل جديد للاختيار في البيع والتقارير.">
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field-row">
                <span>كود العميل</span>
                <input className="field-input" value={form.code} onChange={handleChange('code')} placeholder="CUS-010" />
              </label>
              <label className="field-row">
                <span>اسم العميل</span>
                <input className="field-input" value={form.name} onChange={handleChange('name')} placeholder="محمد علي" />
              </label>
            </div>
            <div className="form-grid">
              <label className="field-row">
                <span>الهاتف</span>
                <input className="field-input" value={form.phone} onChange={handleChange('phone')} placeholder="0100..." />
              </label>
              <label className="field-row">
                <span>البريد</span>
                <input className="field-input" value={form.email} onChange={handleChange('email')} placeholder="name@example.com" />
              </label>
            </div>
            <div className="form-grid">
              <label className="field-row">
                <span>العنوان</span>
                <input className="field-input" value={form.address} onChange={handleChange('address')} placeholder="القاهرة" />
              </label>
              <label className="field-row">
                <span>الائتمان</span>
                <input className="field-input" value={form.creditLimit} onChange={handleChange('creditLimit')} placeholder="0" />
              </label>
            </div>
            <button className="primary-button primary-button-wide" disabled={saving} type="submit">
              {saving ? 'جارٍ الحفظ...' : 'حفظ العميل'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
