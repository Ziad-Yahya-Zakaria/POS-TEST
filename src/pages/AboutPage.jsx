import { aboutHighlights, systemModules } from '../data/setup.js'
import { PageHeader, Panel } from '../components/PageBlocks.jsx'

export function AboutPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="عن النظام"
        title="صفحة عن البرنامج"
        description="ملخص عن نطاق برنامج POS الحالي، الوحدات الرئيسية، والنسخة الأولية المبنية على React وNode."
        actions={['مشاركة النظرة العامة']}
      />

      <div className="metric-grid metric-grid-compact">
        {aboutHighlights.map((item) => (
          <article key={item.label} className="metric-card metric-card-info">
            <p className="metric-label">{item.label}</p>
            <strong className="metric-value metric-value-small">{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="content-grid two-columns">
        <Panel title="الوحدات الأساسية" subtitle="الأجزاء التي تغطيها النسخة الحالية من الواجهة.">
          <div className="module-list">
            {systemModules.map((module) => (
              <article key={module.title} className="module-card">
                <strong>{module.title}</strong>
                <p>{module.summary}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="ماذا بعد؟" subtitle="نقاط التطوير المنطقية للمرحلة التالية.">
          <div className="stack-list">
            <article className="stack-item">
              <div>
                <h3 className="stack-item-title">ربط API فعلي</h3>
                <p className="stack-item-note">ربط الصفحات ببيانات حقيقية عبر Node/Express أو خدمة backend مناسبة.</p>
              </div>
            </article>
            <article className="stack-item">
              <div>
                <h3 className="stack-item-title">إدارة صلاحيات كاملة</h3>
                <p className="stack-item-note">ربط الدخول بالأدوار، الفروع، وسياسات الموافقات.</p>
              </div>
            </article>
            <article className="stack-item">
              <div>
                <h3 className="stack-item-title">تقارير تفاعلية</h3>
                <p className="stack-item-note">إضافة رسوم بيانية، فلاتر زمنية، وتصدير متقدم.</p>
              </div>
            </article>
          </div>
        </Panel>
      </div>
    </div>
  )
}
