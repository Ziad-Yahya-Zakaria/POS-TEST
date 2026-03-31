import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginHighlights } from '../data/setup.js'

export function LoginPage() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('nfc')
  const [form, setForm] = useState({
    username: 'cashier01',
    password: '123456',
    nfc: 'CARD-0148',
  })

  function handleChange(field) {
    return (event) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="login-shell">
      <section className="login-card">
        <div>
          <p className="page-header-eyebrow">تسجيل الدخول</p>
          <h1 className="page-title">دخول عبر NFC أو اسم المستخدم</h1>
          <p className="page-description">
            واجهة أولية لتسجيل الدخول إلى برنامج POS مع دعم الدخول السريع للكاشير.
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

          <button className="primary-button primary-button-wide" type="submit">
            الدخول إلى النظام
          </button>
        </form>

        <div className="login-note">
          <strong>وضع تجريبي</strong>
          <p>بضغطة واحدة سيتم نقلك إلى الداشبورد لمراجعة كل صفحات النظام.</p>
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
            <span>24</span>
            <p>صفحة تشغيلية داخل النسخة الحالية</p>
          </article>
          <article className="hero-stat">
            <span>RTL</span>
            <p>واجهة عربية مناسبة للكاشير والإدارة</p>
          </article>
          <article className="hero-stat">
            <span>Node + React</span>
            <p>مبني بجافاسكربت مع Vite و React Router</p>
          </article>
        </div>
      </section>
    </div>
  )
}
