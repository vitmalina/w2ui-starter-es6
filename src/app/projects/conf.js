import { w2utils } from '../../libs/w2ui/w2ui.es6.min.js'

export default {
    project_sb: {
        name: 'project_sb',
        nodes: [
            { id: 'pg-start', text: 'Overview', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'pg-overview', text: 'Summary', icon: 'icon-combo-chart', route: '/projects/overview' },
                    { id: 'pg-list', text: 'All projects', icon: 'icon-apps', route: '/projects/list' },
                ],
            },
            { id: 'pg-plan', text: 'Plan & track', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'pg-milestones', text: 'Milestones', icon: 'icon-target', route: '/projects/milestones' },
                    { id: 'pg-board', text: 'Board', icon: 'icon-tiles', route: '/projects/board' },
                    { id: 'pg-timeline', text: 'Timeline', icon: 'icon-time-line', route: '/projects/timeline' },
                ],
            },
            { id: 'pg-people', text: 'People & files', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'pg-team', text: 'Team', icon: 'icon-group', route: '/projects/team' },
                    { id: 'pg-files', text: 'Files & docs', icon: 'icon-folder-open2', route: '/projects/files' },
                    { id: 'pg-settings', text: 'Project settings', icon: 'icon-settings', route: '/projects/settings' },
                ],
            }
        ]
    },

    projects: {
        name: 'projects',
        url: app.context + '../api/projects',
        show: {
            toolbar: true,
            footer: true
        },
        toolbar: {
            items: [
                { type: 'menu-radio', text: 'Action', icon: 'icon-filter',
                    items: [
                        { id: 'start', text: 'Start', icon: 'icon-off' },
                        { id: 'process', text: 'Process Logs', icon: 'icon-home' }
                    ]
                }
            ]
        },
        style: 'border: 0',
        columns: [
            { field: 'project_name', text: 'Project', size: '240px', searchable: true, sortable: true,
                render(rec) { return w2utils.encodeTags(rec.project_name ?? '') } },
            { field: 'status', text: 'Status', size: '108px', searchable: true, sortable: true,
                render(rec) {
                    const colors = {
                        Active: '#16b364', Planning: '#2563eb', 'On hold': '#94a3b8',
                        Complete: '#0d9488', Canceled: '#64748b'
                    }
                    const s = rec.status ?? ''
                    const c = colors[s] || '#475569'
                    return `<span style="color:${c};font-weight:600;">${w2utils.encodeTags(s)}</span>`
                } },
            { field: 'owner', text: 'Owner', size: '128px', searchable: true, sortable: true,
                render(rec) { return w2utils.encodeTags(rec.owner ?? '') } },
            { field: 'team', text: 'Team', size: '112px', searchable: true, sortable: true,
                render(rec) { return w2utils.encodeTags(rec.team ?? '') } },
            { field: 'start_date', text: 'Start', size: '100px', searchable: 'date', sortable: true,
                render(rec) { return w2utils.encodeTags(rec.start_date ?? '') } },
            { field: 'target_date', text: 'Target', size: '100px', searchable: 'date', sortable: true,
                render(rec) { return w2utils.encodeTags(rec.target_date ?? '') } },
            { field: 'progress', text: 'Progress', size: '88px', searchable: true, sortable: true, style: 'text-align: right',
                render(rec) {
                    const p = Math.min(100, Math.max(0, Number(rec.progress) || 0))
                    const c = p >= 80 ? '#16b364' : p >= 40 ? '#d68f00' : '#2563eb'
                    return `<span style="color:${c};font-weight:700;font-variant-numeric:tabular-nums;">${p}%</span>`
                } },
            { field: 'priority', text: 'Priority', size: '92px', searchable: true, sortable: true,
                render(rec) {
                    const colors = { High: '#c2410c', Medium: '#b45309', Low: '#64748b' }
                    const p = rec.priority ?? ''
                    const c = colors[p] || '#64748b'
                    return `<span style="color:${c};font-weight:600;">${w2utils.encodeTags(p)}</span>`
                } },
            { field: 'budget', text: 'Budget', size: '80px', searchable: true, sortable: true, style: 'text-align: right',
                render(rec) { return w2utils.encodeTags(rec.budget ?? '') } }
        ]
    }
}