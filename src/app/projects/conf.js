export default {
    project_sb: {
        name: 'project_sb',
        nodes: [
            { id: 'general', text: 'General', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'projects', text: 'Projects', icon: 'icon-star', route: '/projects/list' },
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