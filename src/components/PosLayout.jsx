import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { allNavigationItems, navigationGroups } from '../data/navigation.js'

function navigationTitle(pathname) {
  const current = allNavigationItems.find((item) => item.path === pathname)
  return current?.label ?? 'لوحة POS'
}

export function PosLayout() {
  const location = useLocation()
  const currentDate = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div>
            <p className="brand-tag">Nawa POS</p>
            <h1 className="brand-title">منصة تشغيل نقاط البيع</h1>
            <p className="brand-summary">
              واجهة تشغيل عربية للمبيعات، المشتريات، الفروع، والدعم الفني.
            </p>
          </div>
          <Link className="primary-button" to="/sales">
            فتح الكاشير
          </Link>
        </div>

        <div className="profile-card">
          <div className="avatar-pill">NM</div>
          <div>
            <p className="profile-name">نورا محمود</p>
            <p className="profile-role">مدير تشغيل - الفرع الرئيسي</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="التنقل الرئيسي">
          {navigationGroups.map((group) => (
            <section key={group.title} className="sidebar-section">
              <p className="sidebar-section-title">{group.title}</p>
              <div className="sidebar-links">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    className={({ isActive }) =>
                      isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
                    }
                    to={item.path}
                  >
                    <span className="sidebar-link-label">{item.label}</span>
                    <span className="sidebar-link-hint">{item.hint}</span>
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="topbar-label">{currentDate}</p>
            <h2 className="topbar-title">{navigationTitle(location.pathname)}</h2>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <span className="visually-hidden">بحث</span>
              <input placeholder="ابحث عن عميل، صنف، أو تقرير" type="search" />
            </label>
            <div className="status-pill">الفرع: المعادي</div>
            <div className="status-pill">الشفت: صباحي</div>
            <Link className="ghost-button" to="/login">
              تبديل المستخدم
            </Link>
          </div>
        </header>

        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
