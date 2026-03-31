import {
  Checklist,
  DataTable,
  MetricGrid,
  PageHeader,
  Panel,
  TimelineList,
} from '../components/PageBlocks.jsx'
import { moduleConfigs } from '../data/moduleConfigs.js'

export function ModulePage({ pageKey }) {
  const config = moduleConfigs[pageKey]

  if (!config) {
    return null
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        actions={config.actions}
      />

      <MetricGrid items={config.metrics} />

      <div className="content-grid two-columns">
        <Panel title={config.table.title} subtitle={config.table.subtitle} className="panel-table">
          <DataTable columns={config.table.columns} rows={config.table.rows} />
        </Panel>

        <div className="content-column">
          <Panel title={config.checklist.title}>
            <Checklist items={config.checklist.items} />
          </Panel>
          <Panel title={config.activity.title}>
            <TimelineList items={config.activity.items} />
          </Panel>
        </div>
      </div>
    </div>
  )
}
