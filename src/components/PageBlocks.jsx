function joinClasses(...values) {
  return values.filter(Boolean).join(' ')
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={joinClasses('badge', `badge-${tone}`)}>{children}</span>
}

export function PageHeader({ eyebrow, title, description, actions = [] }) {
  return (
    <header className="page-header">
      <div>
        <p className="page-header-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {actions.length > 0 ? (
        <div className="page-actions">
          {actions.map((action) => (
            <button key={action} className="ghost-button" type="button">
              {action}
            </button>
          ))}
        </div>
      ) : null}
    </header>
  )
}

export function MetricGrid({ items }) {
  return (
    <section className="metric-grid">
      {items.map((item) => (
        <article key={item.label} className={joinClasses('metric-card', `metric-card-${item.tone ?? 'neutral'}`)}>
          <p className="metric-label">{item.label}</p>
          <strong className="metric-value">{item.value}</strong>
          <div className="metric-footer">
            <span className="metric-delta">{item.delta}</span>
            <Badge tone={item.tone ?? 'neutral'}>
              {item.tone === 'success'
                ? 'جيد'
                : item.tone === 'warning'
                  ? 'تنبيه'
                  : item.tone === 'danger'
                    ? 'حرج'
                    : item.tone === 'info'
                      ? 'متابعة'
                      : 'مستقر'}
            </Badge>
          </div>
        </article>
      ))}
    </section>
  )
}

export function Panel({ title, subtitle, action, className, children }) {
  return (
    <section className={joinClasses('panel', className)}>
      {(title || subtitle || action) ? (
        <div className="panel-head">
          <div>
            {title ? <h2 className="panel-title">{title}</h2> : null}
            {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="panel-action">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

function renderCell(value) {
  if (value && typeof value === 'object' && value.kind === 'badge') {
    return <Badge tone={value.tone}>{value.label}</Badge>
  }

  return value
}

export function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[columns[0].key]}-${index}`}>
              {columns.map((column) => (
                <td key={column.key}>{renderCell(row[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Checklist({ items }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <article key={item.label} className="stack-item">
          <div>
            <h3 className="stack-item-title">{item.label}</h3>
            <p className="stack-item-note">{item.hint}</p>
          </div>
          <Badge tone="info">{item.status}</Badge>
        </article>
      ))}
    </div>
  )
}

export function TimelineList({ items }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <article key={`${item.title}-${item.meta}`} className="stack-item">
          <div>
            <h3 className="stack-item-title">{item.title}</h3>
            <p className="stack-item-note">{item.meta}</p>
          </div>
          <Badge tone={item.tone ?? 'neutral'}>{item.meta}</Badge>
        </article>
      ))}
    </div>
  )
}
