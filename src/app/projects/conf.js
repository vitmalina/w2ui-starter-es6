export default {
    project_sb: {
        name: 'project_sb',
        nodes: [
            { id: 'pg-start', text: 'Overview', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'pg-overview', text: 'Summary', icon: 'icon-stats', route: '/projects/overview' },
                    { id: 'pg-list', text: 'All projects', icon: 'icon-table', route: '/projects/list' },
                ],
            },
            { id: 'pg-plan', text: 'Plan & track', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'pg-milestones', text: 'Milestones', icon: 'icon-flag', route: '/projects/milestones' },
                    { id: 'pg-board', text: 'Board', icon: 'icon-arrange', route: '/projects/board' },
                    { id: 'pg-timeline', text: 'Timeline', icon: 'icon-histogram', route: '/projects/timeline' },
                ],
            },
            { id: 'pg-people', text: 'People & files', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'pg-team', text: 'Team', icon: 'icon-users', route: '/projects/team' },
                    { id: 'pg-files', text: 'Files & docs', icon: 'icon-file', route: '/projects/files' },
                    { id: 'pg-settings', text: 'Project settings', icon: 'icon-cog', route: '/projects/settings' },
                ],
            }
        ]
    },

    projects: {
        name: 'projects',
        url: app.context + 'api/projects',
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
            { field: 'project_name', text: 'Project', size: '100%', searchable: true },
            { field: 'start_date', text: 'Started', size: '100px', searchable: 'date' }
        ]
    }
}