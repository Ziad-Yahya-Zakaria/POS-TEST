import { useState } from 'react'
import { invoiceItems, invoiceSections } from '../data/sales.js'
import { Badge, PageHeader, Panel } from '../components/PageBlocks.jsx'

export function InvoiceDesignerPage() {
  const [paperSize, setPaperSize] = useState('80mm')
  const [accent, setAccent] = useState('#c96b2c')
  const [footerNote, setFooterNote] = useState('شكراً لزيارتكم. يمكن الاستبدال خلال 24 ساعة مع الفاتورة.')

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="تصميم الفاتورة"
        title="شكل الفاتورة"
        description="تخصيص مظهر الفاتورة المطبوعة أو الرقمية بما يناسب النشاط التجاري وهوية العلامة."
        actions={['حفظ القالب', 'معاينة للطابعة']}
      />

      <div className="invoice-grid">
        <Panel title="خيارات التصميم" subtitle="تحكم سريع بالعناصر الأساسية للفاتورة.">
          <div className="form-stack">
            <label className="field-row">
              <span>مقاس الورق</span>
              <select
                className="field-input"
                value={paperSize}
                onChange={(event) => setPaperSize(event.target.value)}
              >
                <option value="80mm">80mm - كاشير</option>
                <option value="A4">A4 - ضريبية</option>
                <option value="digital">نسخة رقمية</option>
              </select>
            </label>

            <label className="field-row">
              <span>لون الهوية</span>
              <input
                className="field-input"
                type="color"
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
              />
            </label>

            <label className="field-row">
              <span>ملاحظة أسفل الفاتورة</span>
              <textarea
                className="field-input"
                rows="4"
                value={footerNote}
                onChange={(event) => setFooterNote(event.target.value)}
              />
            </label>

            <div className="toggle-list">
              {invoiceSections.map((section) => (
                <div key={section.id} className="toggle-item">
                  <div>
                    <strong>{section.label}</strong>
                    <p className="stack-item-note">يمكن تفعيل أو إخفاء هذا الجزء من القالب.</p>
                  </div>
                  <Badge tone={section.enabled ? 'success' : 'warning'}>
                    {section.enabled ? 'مفعل' : 'مخفي'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="المعاينة المباشرة" subtitle="نموذج بصري لنسخة الفاتورة النهائية.">
          <div className="invoice-paper" style={{ '--invoice-accent': accent }}>
            <div className="invoice-head">
              <div>
                <p className="invoice-brand">Nawa POS</p>
                <h3>فاتورة مبيعات</h3>
              </div>
              <Badge tone="info">{paperSize}</Badge>
            </div>

            <div className="invoice-meta">
              <span>الفرع: المعادي</span>
              <span>الكاشير: عمر سامي</span>
              <span>الفاتورة: POS-8201</span>
            </div>

            <div className="invoice-lines">
              {invoiceItems.map((item) => (
                <div key={item.name} className="invoice-line">
                  <span>{item.name}</span>
                  <span>x{item.qty}</span>
                  <strong>{item.total}</strong>
                </div>
              ))}
            </div>

            <div className="invoice-totals">
              <div className="amount-list">
                <span>الإجمالي الفرعي</span>
                <strong>EGP 166</strong>
              </div>
              <div className="amount-list">
                <span>الضريبة</span>
                <strong>EGP 23</strong>
              </div>
              <div className="amount-list amount-total">
                <span>الإجمالي</span>
                <strong>EGP 189</strong>
              </div>
            </div>

            <div className="invoice-footer">
              <p>{footerNote}</p>
              <div className="invoice-qr">QR</div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
