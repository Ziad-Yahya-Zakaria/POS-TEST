import { useState } from 'react'
import { businessTypes } from '../data/setup.js'
import { Badge, PageHeader, Panel } from '../components/PageBlocks.jsx'

export function BusinessTypePage() {
  const [activeType, setActiveType] = useState(businessTypes[0])

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="تهيئة النشاط"
        title="نوع النشاط التجاري والبيانات المناسبة له"
        description="اختيار نوع النشاط منذ البداية يساعد في إظهار الحقول والصفحات والضوابط المناسبة داخل النظام."
        actions={['تثبيت النوع الحالي', 'مقارنة الأنشطة']}
      />

      <div className="content-grid two-columns">
        <Panel title="أنواع الأنشطة" subtitle="اختر المجال الأقرب لطريقة التشغيل الفعلية لديك.">
          <div className="sector-grid">
            {businessTypes.map((type) => (
              <button
                key={type.id}
                className={activeType.id === type.id ? 'sector-card sector-card-active' : 'sector-card'}
                type="button"
                onClick={() => setActiveType(type)}
              >
                <strong>{type.title}</strong>
                <p>{type.description}</p>
                <span>{type.fit}</span>
              </button>
            ))}
          </div>
        </Panel>

        <div className="content-column">
          <Panel title={activeType.title} subtitle={activeType.description}>
            <div className="details-block">
              <div>
                <p className="panel-subtitle">أفضل استخدام</p>
                <strong className="details-highlight">{activeType.fit}</strong>
              </div>

              <div>
                <p className="panel-subtitle">البيانات المناسبة لهذا النشاط</p>
                <div className="chip-cloud">
                  {activeType.fields.map((field) => (
                    <span key={field} className="field-chip">
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="panel-subtitle">إضافات تشغيلية مقترحة</p>
                <div className="addon-list">
                  {activeType.addons.map((addon) => (
                    <div key={addon} className="addon-item">
                      <Badge tone="success">جاهز</Badge>
                      <span>{addon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
