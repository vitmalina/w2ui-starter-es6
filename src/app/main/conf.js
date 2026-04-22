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
                w2ui.app_layout.set('left', { size: 45, minSize: 45, resizable: false })
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
                    { id: 'icons', text: 'Icons', icon: 'icon-star', route: '/home/icons' },
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
            { field: 'status', text: 'Status', size: '100%',  searchable: true, sortable: true,
                render(record) {
                    let colors = { Active: '#2a9d3e', Inactive: '#888', Pending: '#d68f00' }
                    let c = colors[record.status] || '#333'
                    return `<span style="color: ${c}; font-weight: 600;">${record.status ?? ''}</span>`
                }
            }
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
    main_form: {
        name: 'main_form',
        style: 'border: 0; background-color: transparent;',
        fields: [
            { field: 'fname',  type: 'text', required: true,
              html: { label: 'First Name', attr: 'style="width: 300px"' } },
            { field: 'lname',  type: 'text', required: true,
              html: { label: 'Last Name',  attr: 'style="width: 300px"' } },
            { field: 'email',  type: 'email', required: true,
              html: { label: 'Email',      attr: 'style="width: 300px"' } },
            { field: 'phone',  type: 'text',
              html: { label: 'Phone',      attr: 'style="width: 300px"' } },
            { field: 'department', type: 'list',
              options: { items: ['IT', 'Engineering', 'Sales', 'Marketing', 'Support', 'HR', 'Finance', 'Operations'] },
              html: { label: 'Department', attr: 'style="width: 300px"' } },
            { field: 'role', type: 'list',
              options: { items: ['Admin', 'Manager', 'Developer', 'Designer', 'Analyst', 'Support', 'Intern'] },
              html: { label: 'Role',       attr: 'style="width: 300px"' } },
            { field: 'status', type: 'list',
              options: { items: ['Active', 'Inactive', 'Pending'] },
              html: { label: 'Status',     attr: 'style="width: 300px"' } }
        ],
        record: {
            fname: '', lname: '', email: '', phone: '',
            department: '', role: '', status: 'Active'
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