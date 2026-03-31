import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'

export function DashboardPage() {
  const [state, setState] = useState({
    metrics: [],
    branches: [],
    alerts: [],
    quickLinks: [],
    source: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        const data = await fetchJson('/api/dashboard')

        if (!cancelled) {
          setState({
            ...data,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : 'تعذر تحميل الداشبورد.',
          }))
        }
      }
    }

    void loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="لوحة التحكم"
        title="داشبورد التشغيل"
        description="متابعة فورية للمبيعات، الشفتات، الفروع، والتنبيهات الحرجة من مكان واحد."
        actions={['تقرير اليوم', 'مراقبة الفروع']}
      />

      {state.source ? (
        <div className="inline-status">
          <Badge tone={state.source === 'sqlserver' ? 'success' : 'warning'}>
            المصدر: {state.source === 'sqlserver' ? 'SQL Server' : 'Mock Data'}
          </Badge>
        </div>
      ) : null}

      {state.error ? (
        <div className="notice-card notice-card-error">
          <strong>تعذر تحميل بيانات الداشبورد</strong>
          <p>{state.error}</p>
        </div>
      ) : null}

      <MetricGrid items={state.metrics} />

      <div className="content-grid two-columns">
        <Panel
          title="أداء الفروع والقنوات"
          subtitle={state.loading ? 'جارٍ تحميل البيانات...' : 'ملخص مبني على بيانات النظام الحالية.'}
        >
          <div className="trend-stack">
            {state.branches.map((branch) => (
              <div key={branch.name} className="trend-row">
                <div>
                  <h3 className="stack-item-title">{branch.name}</h3>
                  <p className="stack-item-note">{branch.manager}</p>
                </div>
                <div className="trend-bar">
                  <span style={{ width: `${branch.revenue}%` }} />
                </div>
                <div className="trend-meta">
                  <strong>{branch.revenue}%</strong>
                  <span>{branch.target}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="content-column">
          <Panel title="تنبيهات مباشرة" subtitle="الأحداث التي تستحق تدخل سريع من الإدارة.">
            <div className="stack-list">
              {state.alerts.map((alert) => (
                <article key={alert.title} className="stack-item">
                  <div>
                    <h3 className="stack-item-title">{alert.title}</h3>
                    <p className="stack-item-note">{alert.note}</p>
                  </div>
                  <Badge tone={alert.tone}>{alert.note}</Badge>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="وصول سريع" subtitle="اختصارات للصفحات الأكثر استخداماً يومياً.">
            <div className="link-grid">
              {state.quickLinks.map((item) => (
                <Link key={item.path} className="quick-link" to={item.path}>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
