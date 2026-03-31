import { Link } from 'react-router-dom'
import {
  branchPerformance,
  dashboardAlerts,
  dashboardMetrics,
  quickLinks,
} from '../data/dashboard.js'
import { Badge, MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'

export function DashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="لوحة التحكم"
        title="داشبورد التشغيل"
        description="متابعة فورية للمبيعات، الشفتات، الفروع، والتنبيهات الحرجة من مكان واحد."
        actions={['تقرير اليوم', 'مراقبة الفروع']}
      />

      <MetricGrid items={dashboardMetrics} />

      <div className="content-grid two-columns">
        <Panel
          title="أداء الفروع والقنوات"
          subtitle="مقارنة سريعة بالنسبة المستهدفة لكل فرع أو قناة بيع."
        >
          <div className="trend-stack">
            {branchPerformance.map((branch) => (
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
              {dashboardAlerts.map((alert) => (
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
              {quickLinks.map((item) => (
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
