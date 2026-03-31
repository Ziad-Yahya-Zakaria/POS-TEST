import { useEffect, useState } from 'react'
import { MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'

const initialUserForm = {
  username: '',
  password: '',
  displayName: '',
  roleId: '',
  branchId: '',
  employeeId: '',
  status: 'ACTIVE',
}

export function EmployeeSettingsPage() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [branches, setBranches] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(initialUserForm)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const [usersData, rolesData, branchesData, employeesData] = await Promise.all([
          fetchJson('/api/users'),
          fetchJson('/api/roles'),
          fetchJson('/api/branches'),
          fetchJson('/api/employees'),
        ])

        if (!cancelled) {
          setUsers(usersData)
          setRoles(rolesData)
          setBranches(branchesData)
          setEmployees(employeesData)
          setForm((current) => ({
            ...current,
            roleId: current.roleId || rolesData[0]?.id || '',
            branchId: current.branchId || branchesData[0]?.id || '',
          }))
          setNotice(null)
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            tone: 'error',
            title: 'تعذر تحميل إعدادات الموظفين',
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
      const created = await fetchJson('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      setUsers((current) => [...current, created])
      setForm((current) => ({
        ...initialUserForm,
        roleId: current.roleId,
        branchId: current.branchId,
      }))
      setNotice({
        tone: 'success',
        title: 'تم إنشاء المستخدم',
        message: `تم إضافة حساب ${created.username} بنجاح.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر إنشاء المستخدم',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setSaving(false)
    }
  }

  const metrics = [
    {
      label: 'حسابات المستخدمين',
      value: String(users.length),
      delta: 'حسابات دخول النظام',
      tone: users.length > 0 ? 'success' : 'warning',
    },
    {
      label: 'الأدوار',
      value: String(roles.length),
      delta: 'صلاحيات معرفة داخل النظام',
      tone: 'info',
    },
    {
      label: 'موظفون قابلون للربط',
      value: String(employees.filter((employee) => !employee.user).length),
      delta: 'لم يرتبطوا بحسابات بعد',
      tone: 'warning',
    },
    {
      label: 'حسابات نشطة',
      value: String(users.filter((user) => user.status === 'ACTIVE').length),
      delta: 'جاهزة لتسجيل الدخول',
      tone: 'neutral',
    },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="إعدادات الموظفين"
        title="إعدادات الموظفين"
        description="إدارة حسابات الدخول، الأدوار، وربط الموظفين بالحسابات داخل SQL Server."
        actions={['إنشاء حساب جديد']}
      />

      <MetricGrid items={metrics} />

      {notice ? (
        <div className={`notice-card ${notice.tone === 'error' ? 'notice-card-error' : 'notice-card-success'}`}>
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
        </div>
      ) : null}

      <div className="content-grid two-columns">
        <Panel title="المستخدمون الحاليون" subtitle="الحسابات الفعلية القادرة على الدخول إلى النظام.">
          <div className="entity-list">
            {users.map((user) => (
              <article key={user.id} className="entity-card">
                <div className="entity-topline">
                  <strong>{user.displayName}</strong>
                  <span className="badge badge-info">{user.username}</span>
                </div>
                <p>{user.role?.name || 'بدون دور'}</p>
                <div className="entity-meta">
                  <span>{user.branch?.name || 'بدون فرع'}</span>
                  <span>{user.status}</span>
                </div>
                <div className="entity-meta">
                  <span>{user.employee?.fullName || 'غير مرتبط بموظف'}</span>
                  <span>{user.employee?.nfcCardCode || 'بدون NFC'}</span>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="إنشاء حساب مستخدم" subtitle="إعطاء موظف حساب دخول وصلاحية محددة.">
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field-row">
                <span>اسم المستخدم</span>
                <input className="field-input" value={form.username} onChange={handleChange('username')} placeholder="user01" />
              </label>
              <label className="field-row">
                <span>كلمة المرور</span>
                <input className="field-input" type="password" value={form.password} onChange={handleChange('password')} placeholder="••••••" />
              </label>
            </div>

            <label className="field-row">
              <span>الاسم الظاهر</span>
              <input className="field-input" value={form.displayName} onChange={handleChange('displayName')} placeholder="أحمد محمود" />
            </label>

            <div className="form-grid">
              <label className="field-row">
                <span>الدور</span>
                <select className="field-input" value={form.roleId} onChange={handleChange('roleId')}>
                  <option value="">اختر دوراً</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
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
                <span>الموظف المرتبط</span>
                <select className="field-input" value={form.employeeId} onChange={handleChange('employeeId')}>
                  <option value="">بدون ربط</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} - {employee.employeeCode}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-row">
                <span>الحالة</span>
                <select className="field-input" value={form.status} onChange={handleChange('status')}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </label>
            </div>

            <button className="primary-button primary-button-wide" disabled={saving} type="submit">
              {saving ? 'جارٍ الحفظ...' : 'إنشاء المستخدم'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
