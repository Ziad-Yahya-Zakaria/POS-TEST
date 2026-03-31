import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { allNavigationItems, navigationGroups } from '../data/navigation.js'
import { clearSession, readSession } from '../lib/session.js'

function navigationTitle(pathname) {
  const current = allNavigationItems.find((item) => item.path === pathname)
  return current?.label ?? 'لوحة POS'
}

function initialsFromName(name) {
  if (!name) {
    return 'PO'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function PosLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentDate = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  const session = readSession()

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  const currentUser = session?.user ?? null
  const displayName = currentUser?.displayName || 'مستخدم النظام'
  const displayRole = currentUser?.role?.name || 'بدون دور'
  const displayBranch = currentUser?.branch?.name || 'غير محدد'
  const avatarInitials = initialsFromName(displayName)

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
          <div className="avatar-pill">{avatarInitials}</div>
          <div>
            <p className="profile-name">{displayName}</p>
            <p className="profile-role">
              {displayRole} - {displayBranch}
            </p>
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
            <div className="status-pill">الفرع: {displayBranch}</div>
            <div className="status-pill">
              {currentUser?.employee?.nfcCardCode ? `NFC: ${currentUser.employee.nfcCardCode}` : 'دخول يدوي'}
            </div>
            <button className="ghost-button" type="button" onClick={handleLogout}>
              تبديل المستخدم
            </button>
          </div>
        </header>

        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
