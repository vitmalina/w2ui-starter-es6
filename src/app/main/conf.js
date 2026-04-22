import { w2popup } from '../../libs/w2ui/w2ui.es6.min.js'
export default {
    // --- Application  Layout
    app_layout: {
        name: 'app_layout',
        style: '',
        panels: [
            { type: 'top', size: '20px', overflow: 'hidden', hidden: true },
            { type: 'left', size: '180px', minSize: 100, resizable: true, style: 'border-right: 1px solid #ddd' },
            { type: 'main', overflow: 'hidden' },
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
            { id: 'main-nav-divider', type: 'break' },
            { id: 'web-demos', text: 'Web Demos', type: 'button', icon: 'icon-earth' },
            { id: 'spacer1', type: 'spacer' },
            { id: 'user', text: 'User Name', type: 'menu',
                items: [
                    { id: 'logout', text: 'Logout', icon: 'icon-off' },
                ]
            }
        ],
        onClick(event) {
            if (event.target === 'web-demos') {
                document.location = 'https://w2ui.com/web/demos/#/combo/1'
            }
        }
    },

    // Flat button functionality, for all sidebars
    sb_proto: {
        flatButton: true,
        onFlat(event) {
            this._savedSelected = this.selected
            if (event.detail.goFlat == true) {
                w2ui.app_layout.set('left', { size: 45, minSize: 45, resizable: false })
                app.main.prefs.set('ui-sidebar-size', 'small')
            } else {
                w2ui.app_layout.set('left', { size: 180, minSize: 100, resizable: true })
                app.main.prefs.set('ui-sidebar-size', 'large')
            }
            event.done(() => {
                let saved = this.selected || this._savedSelected
                this._savedSelected = null
                if (saved && this.get(saved)) this.select(saved)
            })
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
                    { id: 'dashboard', text: 'Dashboard', icon: 'icon-stats', route: '/home/dashboard' },
                    { id: 'home', text: 'Users', icon: 'icon-users', route: '/home/users' },
                    { id: 'other', text: 'Other', icon: 'icon-callouts', route: '/home/other' },
                    { id: 'icons', text: 'Icons Lib', icon: 'icon-star', route: '/home/icons' },
                    { id: 'readme', text: 'Read Me', icon: 'icon-books', route: '/home/readme' },
                ],
            },
            { id: 'analytics', text: 'Analytics', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'reports', text: 'Reports', icon: 'icon-file', route: '/home/reports' },
                    { id: 'performance', text: 'Performance', icon: 'icon-heartbeat', route: '/home/performance' },
                    { id: 'activity', text: 'Activity', icon: 'icon-histogram', route: '/home/activity' },
                    { id: 'revenue', text: 'Revenue', icon: 'icon-coin-dollar', route: '/home/revenue' },
                ],
            },
            { id: 'management', text: 'Management', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'tasks', text: 'Tasks', icon: 'icon-list-check', route: '/home/tasks' },
                    { id: 'messages', text: 'Messages', icon: 'icon-callouts', route: '/home/messages' },
                    { id: 'notifications', text: 'Notifications', icon: 'icon-flag', route: '/home/notifications' },
                    { id: 'settings', text: 'Settings', icon: 'icon-cog', route: '/home/settings' },
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
            { field: 'fname', text: 'First Name', size: '110px', searchable: true, sortable: true },
            { field: 'lname', text: 'Last Name',  size: '110px', searchable: true, sortable: true },
            { field: 'email', text: 'Email',      size: '200px', searchable: true, sortable: true },
            { field: 'phone', text: 'Phone',      size: '130px', searchable: true },
            { field: 'department', text: 'Department', size: '120px', searchable: true, sortable: true },
            { field: 'role',   text: 'Role',   size: '110px', searchable: true, sortable: true },
            { field: 'status', text: 'Status', size: '100px',  searchable: true, sortable: true,
                render(record) {
                    let colors = { Active: '#2a9d3e', Inactive: '#888', Pending: '#d68f00' }
                    let c = colors[record.status] || '#333'
                    return `<span style="color: ${c}; font-weight: 600;">${record.status ?? ''}</span>`
                }
            },
            { field: 'comments', text: 'Comments', size: '100%', searchable: true }
        ],
        onAdd(event) {
            app.main.openUserForm()
        },
        onEdit(event) {
            let sel = this.getSelection()
            if (sel.length === 0) return
            app.main.openUserForm(this.get(sel[0]))
        },
        onDblClick(event) {
            app.main.openUserForm(this.get(event.detail.recid))
        }
    },

    // --- User Edit Form (rendered inside w2popup)
    // fields as plain object: use type 'group' + nested fields object (w2ui 2.0); object key is the group title.
    main_form: {
        name: 'main_form',
        style: 'border: 0; background-color: transparent;',
        fields: {
            'Contact': {
                type: 'group',
                fields: {
                    fname: {
                        type: 'text', required: true,
                        html: { label: 'First Name', span: 4, attr: 'style="width: 300px"' }
                    },
                    lname: {
                        type: 'text', required: true,
                        html: { label: 'Last Name', span: 4, attr: 'style="width: 300px"' }
                    },
                    email: {
                        type: 'email', required: true,
                        html: { label: 'Email', span: 4, attr: 'style="width: 300px"' }
                    },
                    phone: {
                        type: 'text',
                        html: { label: 'Phone', span: 4, attr: 'style="width: 300px"' }
                    }
                }
            },
            'Organization': {
                type: 'group',
                fields: {
                    department: {
                        type: 'list',
                        options: { items: ['IT', 'Engineering', 'Sales', 'Marketing', 'Support', 'HR', 'Finance', 'Operations'] },
                        html: { label: 'Department', span: 4, attr: 'style="width: 180px"' }
                    },
                    role: {
                        type: 'list',
                        options: { items: ['Admin', 'Manager', 'Developer', 'Designer', 'Analyst', 'Support', 'Intern'] },
                        html: { label: 'Role', span: 4, attr: 'style="width: 180px"' }
                    },
                    status: {
                        type: 'list',
                        options: { items: ['Active', 'Inactive', 'Pending'] },
                        html: { label: 'Status', span: 4, attr: 'style="width: 180px"' }
                    }
                }
            },
            'Notes': {
                type: 'group',
                fields: {
                    comments: {
                        type: 'textarea',
                        html: { label: 'Comments', span: 0, attr: 'style="width: 100%; height: 80px; box-sizing: border-box"' }
                    }
                }
            }
        },
        record: {
            fname: '', lname: '', email: '', phone: '',
            department: '', role: '', status: 'Active', comments: ''
        },
        actions: {
            Save() {
                let errs = this.validate()
                if (errs.length > 0) return
                let rec = this.getCleanRecord()
                // normalize list values back to plain strings
                ;['department', 'role', 'status'].forEach(f => {
                    if (rec[f] && typeof rec[f] === 'object') {
                        rec[f] = rec[f].text ?? rec[f].id ?? ''
                    }
                })
                let grid = w2ui.main_grid
                if (this.recid == null || this.recid === 0) {
                    let maxId = 0
                    grid.records.forEach(r => { if (r.recid > maxId) maxId = r.recid })
                    rec.recid = maxId + 1
                    rec.userid = rec.recid
                    grid.add(rec)
                    grid.selectNone()
                    grid.select(rec.recid)
                    grid.scrollIntoView(rec.recid)
                } else {
                    grid.set(this.recid, rec)
                }
                w2popup.close()
            },
            Cancel() {
                w2popup.close()
            }
        }
    }
}