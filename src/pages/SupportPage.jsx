import { supportChannels, supportTickets } from '../data/setup.js'
import { Badge, PageHeader, Panel } from '../components/PageBlocks.jsx'

export function SupportPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="خدمة ما بعد التشغيل"
        title="صفحة الدعم الفني"
        description="واجهة لمتابعة التذاكر، القنوات السريعة، وتشخيص المشاكل التشغيلية عبر الفروع."
        actions={['فتح تذكرة', 'مشاركة لوج تشخيصي']}
      />

      <div className="content-grid two-columns">
        <Panel title="قنوات التواصل" subtitle="اختيارات الاتصال المتاحة للمستخدمين والإدارة.">
          <div className="channel-list">
            {supportChannels.map((channel) => (
              <article key={channel.title} className="support-card">
                <div>
                  <strong>{channel.title}</strong>
                  <p>{channel.detail}</p>
                </div>
                <Badge tone="info">{channel.status}</Badge>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="التذاكر الحالية" subtitle="آخر الحالات المفتوحة أو المغلقة في بيئة التشغيل.">
          <div className="channel-list">
            {supportTickets.map((ticket) => (
              <article key={ticket.id} className="support-card">
                <div>
                  <strong>{ticket.id}</strong>
                  <p>{ticket.issue}</p>
                  <span className="stack-item-note">{ticket.owner}</span>
                </div>
                <Badge tone={ticket.status === 'تم الحل' ? 'success' : ticket.status === 'بانتظار العميل' ? 'warning' : 'info'}>
                  {ticket.status}
                </Badge>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="فحص سريع قبل التصعيد" subtitle="نقاط عملية لتقليل زمن حل المشكلة.">
        <div className="support-checks">
          <article className="quick-link">
            <strong>مشاكل الطباعة</strong>
            <p>تأكد من الجهاز الافتراضي، حالة الورق، والاتصال بالطابعة داخل إعدادات الفرع.</p>
          </article>
          <article className="quick-link">
            <strong>بطء المزامنة</strong>
            <p>راجع الاتصال، وضع الأوفلاين، وسجل التكامل قبل فتح التذكرة.</p>
          </article>
          <article className="quick-link">
            <strong>تعذر دخول NFC</strong>
            <p>راجع تفعيل البطاقة داخل إعدادات الموظفين وصلاحيات نقطة البيع.</p>
          </article>
          <article className="quick-link">
            <strong>خطأ في الفاتورة</strong>
            <p>راجع إعدادات الضريبة، شكل الفاتورة، والقناة البيعية المرتبطة بالفرع.</p>
          </article>
        </div>
      </Panel>
    </div>
  )
}
