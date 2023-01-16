// ============================================
// -- Application Configuration

export default {
    // --- Application  Layout
    app_layout: {
        name: 'app_layout',
        style: '',
        panels: [
            { type: 'top', size: '20px', overflow: 'hidden', hidden: true },
            { type: 'left', size: '180px', minSize: 100, resizable: true, style: 'border-right: 1px solid #ddd' },
            { type: 'main', overflow: 'hidden', style: 'background-color: white;' },
            { type: 'right', size: '400px', resizable: true, hidden: true, style: 'border-left: 1px solid #ddd' },
            { type: 'preview', size: '200px', overflow: 'hidden', hidden: true, resizable: true },
            { type: 'bottom', size: '40px', hidden: true }
        ]
    },

    // --- Application Top Toolbar (if any)
    app_tb: {
        name: 'app_tb',
        items: [
            { id: 'home', text: 'Home', type: 'radio', group: 'main', icon: 'icon-home', route: '/home' },
            { id: 'projects', text: 'Projects', type: 'radio', group: 'main', icon: 'icon-pencil-ruler', route: '/projects' },
            { id: 'spacer1', type: 'spacer' },
            { id: 'user', text: 'User Name', type: 'menu',
                items: [
                    { id: 'logout', text: 'Logout', icon: 'icon-off' },
                ]
            }
        ],
        onClick(event) {

        }
    },

    // Flat button functionality, for all sidebars
    sb_proto: {
        flatButton: true,
        onFlat(event) {
            if (event.detail.goFlat == true) {
                w2ui.app_layout.set('left', { size: 35, minSize: 35, resizable: false })
                app.main.prefs.set('ui-sidebar-size', 'small')
            } else {
                w2ui.app_layout.set('left', { size: 180, minSize: 100, resizable: true })
                app.main.prefs.set('ui-sidebar-size', 'large')
            }
        },
        onRender(event) {
            event.done(function () {
                if (app.main.prefs.get('ui-sidebar-size') == 'small' && this.flat != true) {
                    this.goFlat(true)
                }
                if (app.main.prefs.get('ui-sidebar-size') == 'large' && this.flat == true) {
                    this.goFlat(false)
                }
            })
        }
    },

    // --- Application Top Toolbar (if any)
    main_sb: {
        name: 'main_sb',
        nodes: [
            { id: 'general', text: 'General', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'home', text: 'Home', icon: 'icon-home', route: '/home' },
                    { id: 'other', text: 'Other', icon: 'icon-callouts', route: '/home/other' },
                ],
            }
        ]
    },

    main_grid: {
        name: 'main_grid',
        url: app.context + 'api/users',
        show: {
            toolbar: true,
            toolbarAdd: true,
            toolbarEdit: true,
            toolbarDelete: true,
            footer: true
        },
        style: 'border: 0',
        columns: [
            { field: 'fname', text: 'First Name', size: '100px', searchable: true },
            { field: 'lname', text: 'Last Name', size: '100px', searchable: true },
            { field: 'email', text: 'Email', size: '100%' }
        ]
    }
}