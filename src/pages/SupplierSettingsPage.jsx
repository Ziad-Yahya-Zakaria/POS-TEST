import { useEffect, useState } from 'react'
import { MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'

const initialSupplierForm = {
  code: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  taxNumber: '',
  paymentTerms: '',
}

export function SupplierSettingsPage() {
  const [suppliers, setSuppliers] = useState([])
  const [form, setForm] = useState(initialSupplierForm)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadSuppliers() {
      try {
        const data = await fetchJson('/api/suppliers')

        if (!cancelled) {
          setSuppliers(data)
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            tone: 'error',
            title: 'تعذر تحميل الموردين',
            message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
          })
        }
      }
    }

    void loadSuppliers()

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
      const created = await fetchJson('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      setSuppliers((current) => [created, ...current])
      setForm(initialSupplierForm)
      setNotice({
        tone: 'success',
        title: 'تم حفظ المورد',
        message: `تم إضافة المورد ${created.name}.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر حفظ المورد',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setSaving(false)
    }
  }

  const metrics = [
    { label: 'إجمالي الموردين', value: String(suppliers.length), delta: 'موردون محفوظون في النظام', tone: suppliers.length > 0 ? 'success' : 'warning' },
    { label: 'شروط دفع مسجلة', value: String(suppliers.filter((item) => item.paymentTerms).length), delta: 'لديهم شروط دفع', tone: 'info' },
    { label: 'موردون برقم ضريبي', value: String(suppliers.filter((item) => item.taxNumber).length), delta: 'مهيؤون للفواتير', tone: 'neutral' },
    { label: 'موردون نشطون', value: String(suppliers.filter((item) => item.isActive).length), delta: 'قابلون للاستخدام', tone: 'warning' },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="الموردون"
        title="إعدادات الموردين"
        description="إدارة الموردين الفعليين المرتبطين بالمشتريات والتوريد."
        actions={['مورد جديد']}
      />

      <MetricGrid items={metrics} />

      {notice ? (
        <div className={`notice-card ${notice.tone === 'error' ? 'notice-card-error' : 'notice-card-success'}`}>
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
        </div>
      ) : null}

      <div className="content-grid two-columns">
        <Panel title="الموردون الحاليون" subtitle="الموردون المحفوظون داخل قاعدة البيانات.">
          <div className="entity-list">
            {suppliers.map((supplier) => (
              <article key={supplier.id} className="entity-card">
                <div className="entity-topline">
                  <strong>{supplier.name}</strong>
                  <span className="badge badge-info">{supplier.code}</span>
                </div>
                <p>{supplier.address || 'بدون عنوان'}</p>
                <div className="entity-meta">
                  <span>{supplier.phone || 'بدون هاتف'}</span>
                  <span>{supplier.email || 'بدون بريد'}</span>
                </div>
                <div className="entity-meta">
                  <span>{supplier.paymentTerms || 'بدون شروط دفع'}</span>
                  <span>{supplier.taxNumber || 'بدون رقم ضريبي'}</span>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="إضافة مورد" subtitle="إنشاء مورد جديد للاستخدام لاحقاً في المشتريات.">
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field-row">
                <span>كود المورد</span>
                <input className="field-input" value={form.code} onChange={handleChange('code')} placeholder="SUP-010" />
              </label>
              <label className="field-row">
                <span>اسم المورد</span>
                <input className="field-input" value={form.name} onChange={handleChange('name')} placeholder="شركة التوريد" />
              </label>
            </div>
            <div className="form-grid">
              <label className="field-row">
                <span>الهاتف</span>
                <input className="field-input" value={form.phone} onChange={handleChange('phone')} placeholder="0100..." />
              </label>
              <label className="field-row">
                <span>البريد</span>
                <input className="field-input" value={form.email} onChange={handleChange('email')} placeholder="supplier@example.com" />
              </label>
            </div>
            <div className="form-grid">
              <label className="field-row">
                <span>العنوان</span>
                <input className="field-input" value={form.address} onChange={handleChange('address')} placeholder="الجيزة" />
              </label>
              <label className="field-row">
                <span>الرقم الضريبي</span>
                <input className="field-input" value={form.taxNumber} onChange={handleChange('taxNumber')} placeholder="312-..." />
              </label>
            </div>
            <label className="field-row">
              <span>شروط الدفع</span>
              <input className="field-input" value={form.paymentTerms} onChange={handleChange('paymentTerms')} placeholder="30 يوم" />
            </label>
            <button className="primary-button primary-button-wide" disabled={saving} type="submit">
              {saving ? 'جارٍ الحفظ...' : 'حفظ المورد'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
