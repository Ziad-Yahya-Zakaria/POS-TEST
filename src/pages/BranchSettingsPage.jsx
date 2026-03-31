import { useEffect, useState } from 'react'
import { MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'

const initialBranchForm = {
  code: '',
  name: '',
  phone: '',
  address: '',
  isHeadOffice: false,
}

export function BranchSettingsPage() {
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState(initialBranchForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadBranches() {
      try {
        const data = await fetchJson('/api/branches')

        if (!cancelled) {
          setBranches(data)
          setNotice(null)
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            tone: 'error',
            title: 'تعذر تحميل الفروع',
            message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
          })
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadBranches()

    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(field) {
    return (event) => {
      const value =
        event.target.type === 'checkbox' ? event.target.checked : event.target.value

      setForm((current) => ({
        ...current,
        [field]: value,
      }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      const created = await fetchJson('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      setBranches((current) => [...current, created])
      setForm(initialBranchForm)
      setNotice({
        tone: 'success',
        title: 'تم حفظ الفرع',
        message: `تم إنشاء الفرع ${created.name} بنجاح.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر حفظ الفرع',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setSaving(false)
    }
  }

  const metrics = [
    {
      label: 'إجمالي الفروع',
      value: String(branches.length),
      delta: 'الفروع المعرفة داخل النظام',
      tone: branches.length > 0 ? 'success' : 'warning',
    },
    {
      label: 'فروع رئيسية',
      value: String(branches.filter((branch) => branch.isHeadOffice).length),
      delta: 'تستخدم كنقطة مرجعية',
      tone: 'info',
    },
    {
      label: 'فروع بها هاتف',
      value: String(branches.filter((branch) => branch.phone).length),
      delta: 'جاهزة للتواصل والطباعة',
      tone: 'neutral',
    },
    {
      label: 'فروع بعنوان',
      value: String(branches.filter((branch) => branch.address).length),
      delta: 'البيانات الأساسية مكتملة',
      tone: 'success',
    },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="إدارة الفروع"
        title="إعدادات الفرع"
        description="إدارة الفروع الفعلية داخل قاعدة البيانات مع بيانات التشغيل الأساسية."
        actions={['إضافة فرع جديد']}
      />

      <MetricGrid items={metrics} />

      {notice ? (
        <div className={`notice-card ${notice.tone === 'error' ? 'notice-card-error' : 'notice-card-success'}`}>
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
        </div>
      ) : null}

      <div className="content-grid two-columns">
        <Panel title="الفروع الحالية" subtitle={loading ? 'جارٍ تحميل الفروع...' : 'الفروع الموجودة حالياً في SQL Server.'}>
          <div className="entity-list">
            {branches.map((branch) => (
              <article key={branch.id} className="entity-card">
                <div className="entity-topline">
                  <strong>{branch.name}</strong>
                  <span className="badge badge-info">{branch.code}</span>
                </div>
                <p>{branch.address || 'بدون عنوان'}</p>
                <div className="entity-meta">
                  <span>{branch.phone || 'بدون هاتف'}</span>
                  <span>{branch.isHeadOffice ? 'فرع رئيسي' : 'فرع تابع'}</span>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="إضافة فرع" subtitle="تخزين الفرع مباشرة داخل قاعدة البيانات.">
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field-row">
                <span>كود الفرع</span>
                <input className="field-input" value={form.code} onChange={handleChange('code')} placeholder="MAD" />
              </label>
              <label className="field-row">
                <span>اسم الفرع</span>
                <input className="field-input" value={form.name} onChange={handleChange('name')} placeholder="فرع المعادي" />
              </label>
            </div>

            <div className="form-grid">
              <label className="field-row">
                <span>الهاتف</span>
                <input className="field-input" value={form.phone} onChange={handleChange('phone')} placeholder="0100..." />
              </label>
              <label className="field-row">
                <span>العنوان</span>
                <input className="field-input" value={form.address} onChange={handleChange('address')} placeholder="القاهرة - المعادي" />
              </label>
            </div>

            <label className="checkbox-row">
              <input checked={form.isHeadOffice} type="checkbox" onChange={handleChange('isHeadOffice')} />
              <span>تعيين كفرع رئيسي</span>
            </label>

            <button className="primary-button primary-button-wide" disabled={saving} type="submit">
              {saving ? 'جارٍ الحفظ...' : 'حفظ الفرع'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
