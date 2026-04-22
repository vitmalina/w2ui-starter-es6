import { w2popup, w2ui, w2utils } from '../../libs/w2ui/w2ui.es6.min.js'

export default {
    // --- Application  Layout
    app_layout: {
        name: 'app_layout',
        style: '',
        panels: [
            { type: 'top', size: '20px', overflow: 'hidden', hidden: true },
            { type: 'left', size: '180px', minSize: 100, resizable: true, style: 'border-right: 1px solid #ddd' },
            { type: 'main', overflow: 'hidden' },
            { type: 'right', size: -350, minSize: 160, resizable: true, hidden: true, style: 'border-left: 1px solid #ddd' },
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
                    { id: 'profile', text: 'Profile', icon: 'icon-user' },
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
                    { id: 'requests', text: 'Requests', icon: 'icon-survey', route: '/home/requests' },
                    { id: 'icons', text: 'Icons Lib', icon: 'icon-icons', route: '/home/icons' },
                    { id: 'readme', text: 'Read Me', icon: 'icon-books', route: '/home/readme' },
                ],
            },
            { id: 'analytics', text: 'Analytics', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'reports', text: 'Reports', icon: 'icon-leaderboard', route: '/home/reports' },
                    { id: 'performance', text: 'Performance', icon: 'icon-gauge2', route: '/home/performance' },
                    { id: 'activity', text: 'Activity', icon: 'icon-time-line', route: '/home/activity' },
                    { id: 'revenue', text: 'Revenue', icon: 'icon-money', route: '/home/revenue' },
                ],
            },
            { id: 'management', text: 'Management', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'tasks', text: 'Tasks', icon: 'icon-list-check', route: '/home/tasks' },
                    { id: 'messages', text: 'Messages', icon: 'icon-mail', route: '/home/messages' },
                    { id: 'notifications', text: 'Notifications', icon: 'icon-lightning', route: '/home/notifications' },
                    { id: 'settings', text: 'Settings', icon: 'icon-settings', route: '/home/settings' },
                ],
            }
        ]
    },

    main_grid: {
        name: 'main_grid',
        url: app.context + '../api/users',
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
    },

    req_grid: {
        name: 'req_grid',
        recordHeight: 65,
        multiSelect: false,
        style: 'border: 0',
        show: {
            toolbar: false,
            footer: false
        },
        columns: [
            {
                field: 'title',
                text: 'Request',
                size: '100%',
                sortable: true,
                render(rec) {
                    let st = rec.status || ''
                    let colors = { Approved: '#2a9d3e', Pending: '#d68f00', Declined: '#c44', Review: '#2563eb', Draft: '#6b7280' }
                    let c = colors[st] || '#6b7280'
                    let meta = `
                        <span class="req-grid-dot" style="background:${c}"></span>
                        <span class="req-grid-status">${w2utils.encodeTags(st)}</span> ${w2utils.encodeTags(rec.submitted || '')}
                    `
                    return `
                    <div class="req-grid-cell">
                        <div class="req-grid-title">${w2utils.encodeTags(rec.title || '')}</div>
                        <div class="req-grid-meta">${meta}</div>
                    </div>`
                }
            }
        ],
        async onSelect(event) {
            await event.complete
            let sel = this.getSelection()
            if (sel.length === 0) return
            let rec = this.get(sel[0])
            if (rec && w2ui.req_form) {
                w2ui.req_form.record = w2utils.clone(rec)
                w2ui.req_form.refresh()
            }
        },
        records: [
            { recid: 1, reqId: 'REQ-2401', title: 'Provision staging API keys', status: 'Pending', submitted: 'Apr 18, 2026 · 09:14', requester: 'Morgan Lee', department: 'Platform', priority: 'High', assignee: 'Alex Kim', description: 'Need scoped keys for the payments sandbox so QA can run the regression pack without touching production.' },
            { recid: 2, reqId: 'REQ-2402', title: 'Extend SSO session to 12h for mobile', status: 'Review', submitted: 'Apr 17, 2026 · 16:42', requester: 'Priya Shah', department: 'Security', priority: 'Normal', assignee: 'Jordan Hayes', description: 'Product wants fewer logins on tablets used in the field. Risk assessment attached; awaiting SecOps sign-off.' },
            { recid: 3, reqId: 'REQ-2403', title: 'Archive 2019 invoices to cold storage', status: 'Approved', submitted: 'Apr 16, 2026 · 11:05', requester: 'Chris Ortiz', department: 'Finance', priority: 'Low', assignee: 'Sam Rivera', description: 'Quarterly retention job; Finance confirmed legal hold exceptions are tagged in the ERP export.' },
            { recid: 4, reqId: 'REQ-2404', title: 'New hire laptops — Design pod (4)', status: 'Pending', submitted: 'Apr 15, 2026 · 08:50', requester: 'Nina Brooks', department: 'IT', priority: 'High', assignee: 'IT Fulfillment', description: 'M2 Pro, 32GB, standard engineering image. Delivery to floor 7 by April 22.' },
            { recid: 5, reqId: 'REQ-2405', title: 'Whitelist partner IP range for webhooks', status: 'Declined', submitted: 'Apr 14, 2026 · 14:18', requester: 'Daniel Voss', department: 'Integrations', priority: 'Normal', assignee: 'NetOps', description: 'Rejected: partner asked for /20; approved narrowed /28 after threat modeling review.' },
            { recid: 6, reqId: 'REQ-2406', title: 'Localization pass — Nordic checkout copy', status: 'Draft', submitted: 'Apr 12, 2026 · 10:22', requester: 'Elin Andersson', department: 'Marketing', priority: 'Normal', assignee: 'Unassigned', description: 'Strings ready in Lokalise; waiting for legal disclaimer variants for FI and NO.' }
        ]
    },

    req_form: {
        name: 'req_form',
        style: 'border: 0; background: transparent; padding: 6px 8px 10px',
        focus: -1,
        fields: {
            'Preview': {
                type: 'group',
                fields: {
                    reqId: {
                        type: 'text',
                        html: { label: 'ID', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    title: {
                        type: 'text',
                        html: { label: 'Title', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    status: {
                        type: 'text',
                        html: { label: 'Status', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    submitted: {
                        type: 'text',
                        html: { label: 'Submitted', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    requester: {
                        type: 'text',
                        html: { label: 'Requester', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    department: {
                        type: 'text',
                        html: { label: 'Department', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    priority: {
                        type: 'text',
                        html: { label: 'Priority', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    assignee: {
                        type: 'text',
                        html: { label: 'Assignee', span: 4, attr: 'style="width: 100%; box-sizing: border-box"' }
                    },
                    description: {
                        type: 'textarea',
                        html: { label: 'Details', span: 4, attr: 'style="width: 100%; height: 100px; box-sizing: border-box; resize: vertical"' }
                    }
                }
            }
        },
        record: {
            reqId: '', title: '', status: '', submitted: '', requester: '', department: '', priority: '', assignee: '', description: ''
        }
    }
}