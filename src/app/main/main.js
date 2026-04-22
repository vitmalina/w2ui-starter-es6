import conf from './conf.js'
import prefs from './prefs.js'
import dashboard from './dashboard.js'
import { query, w2ui, w2utils, w2toolbar, w2layout, w2sidebar, w2grid, w2form, w2popup } from '../../libs/w2ui/w2ui.es6.min.js'

let app_layout = new w2layout(conf.app_layout)
let app_tb = new w2toolbar(conf.app_tb)
let main_sb = new w2sidebar(Object.assign(conf.main_sb, conf.sb_proto))
let main_grid = new w2grid(conf.main_grid)
let main_form = new w2form(conf.main_form)

// display
app_tb.render('#app-toolbar')
app_layout.render('#app-main')
query('#app-container').show()

app.router.add({

    '/home*'(event) {
        w2ui.app_layout.html('left', main_sb)
        w2ui.app_tb.uncheck(...w2ui.app_tb.get())
        w2ui.app_tb.check('home')
    },

    '/home/users'(event) {
        w2ui.main_sb.select('home')
        w2ui.app_layout.html('main', main_grid)
    },

    '/home/dashboard'(event) {
        w2ui.main_sb.select('dashboard')
        let promise = w2ui.app_layout.html('main',
            '<div id="dashboard-host" class="dashboard-host" ' +
            'style="width:100%;height:100%;overflow:auto;"></div>')
        // destroy chart instances when the main panel switches to something else,
        // otherwise ApexCharts animations keep writing to detached SVG nodes.
        if (promise && typeof promise.removed == 'function') {
            promise.removed(() => dashboard.destroy())
        }
        requestAnimationFrame(() => {
            let host = document.getElementById('dashboard-host')
            if (host) dashboard.render(host)
        })
    },

    '/home/other'(event) {
        w2ui.main_sb.select('other')
        w2ui.app_layout.html('main', `
            <div class="w2ui-centered" style="font-size: 16px; color: gray">
                You can refresh this page, it will still come to this sidebar item
            </div>`)
    },

    '/home/icons'(event) {
        w2ui.main_sb.select('icons')
        w2ui.app_layout.html('main', `
            <iframe src="${app.context}icons/preview.html"
                style="width: 100%; height: 100%; border: 0; display: block;"></iframe>`)
    }
})
app.main = { prefs, openUserForm, dashboard }
app.main.prefs.init({
    "ui-sidebar-size":"large"
})

function openUserForm(record) {
    let form = w2ui.main_form
    let isEdit = !!record
    if (isEdit) {
        form.recid = record.recid
        form.record = w2utils.clone(record)
    } else {
        form.recid = 0
        form.record = {
            fname: '', lname: '', email: '', phone: '',
            department: '', role: '', status: 'Active'
        }
    }
    w2popup.open({
        title: isEdit ? `Edit User: ${record.fname ?? ''} ${record.lname ?? ''}`.trim() : 'Add New User',
        body: '<div id="main-form-box" style="width: 100%; height: 100%;"></div>',
        style: 'padding: 0',
        width: 520,
        height: 480,
        showMax: false,
        async onOpen(event) {
            await event.complete
            form.render('#main-form-box')
        }
    })
}

app.router.process()

export default app.main