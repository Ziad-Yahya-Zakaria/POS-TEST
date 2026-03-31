import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginHighlights } from '../data/setup.js'
import { fetchJson } from '../lib/api.js'
import { readSession, saveSession } from '../lib/session.js'

export function LoginPage() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('nfc')
  const [form, setForm] = useState({
    username: 'cashier01',
    password: '123456',
    nfc: 'CARD-0148',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState(null)
  const [bootstrap, setBootstrap] = useState(null)

  useEffect(() => {
    const existingSession = readSession()

    if (existingSession?.user) {
      navigate('/dashboard')
      return undefined
    }

    let cancelled = false

    async function loadBootstrap() {
      try {
        const data = await fetchJson('/api/auth/bootstrap')

        if (!cancelled) {
          setBootstrap(data)
        }
      } catch {
        if (!cancelled) {
          setBootstrap(null)
        }
      }
    }

    void loadBootstrap()

    return () => {
      cancelled = true
    }
  }, [navigate])

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
    setIsSubmitting(true)
    setNotice(null)

    const payload =
      method === 'nfc'
        ? {
            method: 'nfc',
            nfc: form.nfc,
          }
        : {
            method: 'user',
            username: form.username,
            password: form.password,
          }

    try {
      const data = await fetchJson('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
 
      saveSession(data)
      navigate('/dashboard')
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر تسجيل الدخول',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-shell">
      <section className="login-card">
        <div>
          <p className="page-header-eyebrow">تسجيل الدخول</p>
          <h1 className="page-title">دخول عبر NFC أو اسم المستخدم</h1>
          <p className="page-description">
            شاشة دخول مرتبطة بالـ API الفعلية. بعد تجهيز SQL Server وتشغيل
            `db:push` و`db:seed` ستعمل ببيانات حقيقية.
          </p>
        </div>

        <div className="method-switch">
          <button
            className={method === 'nfc' ? 'primary-button' : 'ghost-button'}
            type="button"
            onClick={() => setMethod('nfc')}
          >
            بطاقة NFC
          </button>
          <button
            className={method === 'user' ? 'primary-button' : 'ghost-button'}
            type="button"
            onClick={() => setMethod('user')}
          >
            يوزر وكلمة مرور
          </button>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          {method === 'nfc' ? (
            <label className="field-row">
              <span>كود البطاقة</span>
              <input
                className="field-input"
                value={form.nfc}
                onChange={handleChange('nfc')}
                placeholder="CARD-0148"
              />
            </label>
          ) : (
            <>
              <label className="field-row">
                <span>اسم المستخدم</span>
                <input
                  className="field-input"
                  value={form.username}
                  onChange={handleChange('username')}
                  placeholder="cashier01"
                />
              </label>
              <label className="field-row">
                <span>كلمة المرور</span>
                <input
                  className="field-input"
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="123456"
                />
              </label>
            </>
          )}

          <button className="primary-button primary-button-wide" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'جارٍ التحقق...' : 'الدخول إلى النظام'}
          </button>
        </form>

        {notice ? (
          <div className={`notice-card notice-card-${notice.tone}`}>
            <strong>{notice.title}</strong>
            <p>{notice.message}</p>
          </div>
        ) : null}

        <div className="login-note">
          <strong>بيانات تجريبية بعد التهيئة</strong>
          {bootstrap ? (
            <p>
              `cashier01 / 123456` أو بطاقة `CARD-0148`
            </p>
          ) : (
            <p>شغّل قاعدة البيانات ثم نفذ `npm run db:push` و `npm run db:seed`.</p>
          )}
        </div>
      </section>

      <section className="login-hero">
        <div className="hero-surface">
          <p className="hero-kicker">POS جاهز للتوسع</p>
          <h2 className="hero-title">هيكل متكامل للمبيعات، الإدارة، والعمليات اليومية.</h2>
          <p className="hero-description">
            صممت الواجهة لتغطي صفحات التشغيل المطلوبة: البيع، المشتريات، التقارير،
            الموظفين، الإعدادات، المرتجعات، والتكامل.
          </p>
        </div>

        <div className="hero-highlight-grid">
          {loginHighlights.map((item) => (
            <article key={item} className="hero-highlight">
              <p>{item}</p>
            </article>
          ))}
        </div>

        <div className="hero-stats">
          <article className="hero-stat">
            <span>SQL Server</span>
            <p>مصمم للعمل على SQL Server Express في النسخة المجانية.</p>
          </article>
          <article className="hero-stat">
            <span>المرفقات</span>
            <p>الصور تحفظ في مجلد خارجي لتقليل استهلاك قاعدة البيانات.</p>
          </article>
          <article className="hero-stat">
            <span>Seed جاهز</span>
            <p>يوجد مستخدم مدير وكاشير وبطاقة NFC افتراضية للاختبار.</p>
          </article>
        </div>
      </section>
    </div>
  )
}
