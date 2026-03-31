import { useEffect, useState } from 'react'
import { MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'

const initialEmployeeForm = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  phone: '',
  nfcCardCode: '',
  branchId: '',
  status: 'ACTIVE',
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState(initialEmployeeForm)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const [employeesData, branchesData] = await Promise.all([
          fetchJson('/api/employees'),
          fetchJson('/api/branches'),
        ])

        if (!cancelled) {
          setEmployees(employeesData)
          setBranches(branchesData)
          setForm((current) => ({
            ...current,
            branchId: current.branchId || branchesData[0]?.id || '',
          }))
          setNotice(null)
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            tone: 'error',
            title: 'تعذر تحميل بيانات الموظفين',
            message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
          })
        }
      }
    }

    void loadData()

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
      const created = await fetchJson('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      setEmployees((current) => [...current, created])
      setForm((current) => ({
        ...initialEmployeeForm,
        branchId: current.branchId || created.branchId,
      }))
      setNotice({
        tone: 'success',
        title: 'تم حفظ الموظف',
        message: `تم إضافة ${created.firstName} ${created.lastName} بنجاح.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر حفظ الموظف',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setSaving(false)
    }
  }

  const metrics = [
    {
      label: 'إجمالي الموظفين',
      value: String(employees.length),
      delta: 'موظفون معرفون داخل النظام',
      tone: employees.length > 0 ? 'success' : 'warning',
    },
    {
      label: 'نشطون',
      value: String(employees.filter((employee) => employee.status === 'ACTIVE').length),
      delta: 'جاهزون للتشغيل',
      tone: 'info',
    },
    {
      label: 'بطاقات NFC',
      value: String(employees.filter((employee) => employee.nfcCardCode).length),
      delta: 'مرتبطة بموظفين',
      tone: 'success',
    },
    {
      label: 'مرتبطون بحسابات',
      value: String(employees.filter((employee) => employee.user).length),
      delta: 'حسابات دخول مفعلة',
      tone: 'neutral',
    },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="فريق العمل"
        title="الموظفين"
        description="إدارة الموظفين الفعليين وربطهم بالفروع وبطاقات NFC."
        actions={['إضافة موظف']}
      />

      <MetricGrid items={metrics} />

      {notice ? (
        <div className={`notice-card ${notice.tone === 'error' ? 'notice-card-error' : 'notice-card-success'}`}>
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
        </div>
      ) : null}

      <div className="content-grid two-columns">
        <Panel title="سجل الموظفين" subtitle="بيانات الموظفين الحالية داخل SQL Server.">
          <div className="entity-list">
            {employees.map((employee) => (
              <article key={employee.id} className="entity-card">
                <div className="entity-topline">
                  <strong>
                    {employee.firstName} {employee.lastName}
                  </strong>
                  <span className="badge badge-info">{employee.employeeCode}</span>
                </div>
                <p>{employee.branch?.name || 'بدون فرع'}</p>
                <div className="entity-meta">
                  <span>{employee.phone || 'بدون هاتف'}</span>
                  <span>{employee.nfcCardCode || 'بدون NFC'}</span>
                </div>
                <div className="entity-meta">
                  <span>{employee.status}</span>
                  <span>{employee.user?.role?.name || 'بدون حساب مستخدم'}</span>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="إضافة موظف" subtitle="إنشاء موظف جديد وربطه بفرع وكارت NFC اختياري.">
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field-row">
                <span>كود الموظف</span>
                <input className="field-input" value={form.employeeCode} onChange={handleChange('employeeCode')} placeholder="EMP-1001" />
              </label>
              <label className="field-row">
                <span>الفرع</span>
                <select className="field-input" value={form.branchId} onChange={handleChange('branchId')}>
                  <option value="">اختر فرعاً</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid">
              <label className="field-row">
                <span>الاسم الأول</span>
                <input className="field-input" value={form.firstName} onChange={handleChange('firstName')} placeholder="أحمد" />
              </label>
              <label className="field-row">
                <span>الاسم الأخير</span>
                <input className="field-input" value={form.lastName} onChange={handleChange('lastName')} placeholder="محمود" />
              </label>
            </div>

            <div className="form-grid">
              <label className="field-row">
                <span>الهاتف</span>
                <input className="field-input" value={form.phone} onChange={handleChange('phone')} placeholder="0100..." />
              </label>
              <label className="field-row">
                <span>بطاقة NFC</span>
                <input className="field-input" value={form.nfcCardCode} onChange={handleChange('nfcCardCode')} placeholder="CARD-2001" />
              </label>
            </div>

            <label className="field-row">
              <span>الحالة</span>
              <select className="field-input" value={form.status} onChange={handleChange('status')}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="VACATION">VACATION</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </label>

            <button className="primary-button primary-button-wide" disabled={saving} type="submit">
              {saving ? 'جارٍ الحفظ...' : 'حفظ الموظف'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
