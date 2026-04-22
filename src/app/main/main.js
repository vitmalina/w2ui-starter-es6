import conf from './conf.js'
import prefs from './prefs.js'
import dashboard from './dashboard.js'
import { query, w2ui, w2utils, w2toolbar, w2layout, w2sidebar, w2grid, w2form, w2popup } from '../../libs/w2ui/w2ui.es6.min.js'

let app_layout = new w2layout(conf.app_layout)
let app_tb = new w2toolbar(conf.app_tb)
let main_sb = new w2sidebar(Object.assign(conf.main_sb, conf.sb_proto))
let main_grid = new w2grid(conf.main_grid)
let main_form = new w2form(conf.main_form)

// --- Read Me: in-panel .md navigation (no iframes)
let readmeBackStack = []
let readmeCurrentUrl = null
let readmeLoadSeq = 0
let readmeNextLoadingMessage = 'Loading...'

function readmeToolbarVisible() {
    let t = document.getElementById('readme-toolbar')
    if (t) {
        t.style.display = readmeBackStack.length > 0 ? 'flex' : 'none'
        t.setAttribute('aria-hidden', readmeBackStack.length > 0 ? 'false' : 'true')
    }
}

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function loadMarkdownInReadmeContent(url, options = {}) {
    let { undoPushOnError = false, _recovery = false } = options
    let seq = ++readmeLoadSeq
    let contentEl = document.getElementById('readme-content')
    if (contentEl) {
        contentEl.innerHTML = `<div class="readme-loading">${escapeHtml(readmeNextLoadingMessage)}</div>`
    }
    readmeNextLoadingMessage = 'Loading...'
    try {
        let res = await fetch(url, { cache: 'no-cache' })
        if (seq !== readmeLoadSeq) return
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        let md = await res.text()
        if (seq !== readmeLoadSeq) return
        let html = window.marked ? window.marked.parse(md) : escapeHtml(md)
        if (contentEl) {
            contentEl.innerHTML = `<div class="readme-body markdown-body">${html}</div>`
        }
        readmeCurrentUrl = url
        readmeToolbarVisible()
    } catch (err) {
        if (seq !== readmeLoadSeq) return
        if (undoPushOnError) readmeBackStack.pop()
        if (undoPushOnError && !_recovery && readmeCurrentUrl) {
            await loadMarkdownInReadmeContent(readmeCurrentUrl, { _recovery: true })
            return
        }
        if (!_recovery && contentEl) {
            contentEl.innerHTML = `
                <div class="w2ui-centered" style="color: #b00; text-align: center; padding: 32px 16px">
                    <div style="font-size: 18px; margin-bottom: 6px">Failed to load document</div>
                    <div style="color: #888; font-size: 13px">${escapeHtml(err.message)}</div>
                </div>`
        }
        readmeToolbarVisible()
    }
}

async function goReadmeBack() {
    let target = readmeBackStack.pop()
    if (!target) return
    await loadMarkdownInReadmeContent(target)
}

function bindReadmeHostOnce() {
    let host = document.getElementById('readme-host')
    if (!host || host._readmeNavBound) return
    host._readmeNavBound = true
    host.addEventListener('click', (e) => {
        if (e.target.closest('.readme-back')) {
            e.preventDefault()
            goReadmeBack()
            return
        }
        if (e.defaultPrevented) return
        if (e.button !== 0) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        let a = e.target.closest('a[href]')
        if (!a) return
        if (a.hasAttribute('download')) return
        if (a.target === '_blank') return
        let href = a.getAttribute('href') || ''
        if (href === '' || href.startsWith('#') || /^(mailto|javascript):/i.test(href)) return
        let url
        try {
            url = new URL(a.href, window.location.href)
        } catch {
            return
        }
        if (url.origin !== window.location.origin) return
        if (!/\.(md|markdown)$/i.test(url.pathname)) return
        e.preventDefault()
        e.stopPropagation()
        let hadPrev = !!readmeCurrentUrl
        if (hadPrev) readmeBackStack.push(readmeCurrentUrl)
        loadMarkdownInReadmeContent(url.href, { undoPushOnError: hadPrev })
    })
}

function openReadmePanel() {
    w2ui.main_sb.select('readme')
    readmeBackStack = []
    readmeCurrentUrl = null
    w2ui.app_layout.html('main', `
        <div id="readme-host" class="readme-host">
            <div id="readme-toolbar" class="readme-toolbar" style="display: none" aria-hidden="true">
                <button type="button" class="readme-back" id="readme-back" title="Back to previous page">← Back</button>
            </div>
            <div id="readme-content" class="readme-content">
                <div class="readme-loading">Loading README...</div>
            </div>
        </div>`)
    bindReadmeHostOnce()
    readmeNextLoadingMessage = 'Loading README...'
    let readmePath = (app.context || '') + 'README.md'
    let readmeUrl
    try {
        readmeUrl = new URL(readmePath, document.baseURI).href
    } catch {
        readmeUrl = new URL('README.md', document.baseURI).href
    }
    loadMarkdownInReadmeContent(readmeUrl)
}

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

    '/home'(event) {
        let node = w2ui.main_sb.get(w2ui.main_sb.selected)
        if (node) {
            // if there was a selected node, go to it
            app.router.go(node.route)
        }
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
    },

    '/home/readme'(event) {
        openReadmePanel()
    },

    '/home/reports'(event)       { showPlaceholder('reports',       'Reports',       'View and export analytical reports here.') },
    '/home/performance'(event)   { showPlaceholder('performance',   'Performance',   'Monitor system and KPI performance metrics here.') },
    '/home/activity'(event)      { showPlaceholder('activity',      'Activity',      'Browse recent user and system activity here.') },
    '/home/revenue'(event)       { showPlaceholder('revenue',       'Revenue',       'Track revenue, invoices, and payouts here.') },
    '/home/tasks'(event)         { showPlaceholder('tasks',         'Tasks',         'Manage your tasks and to-do items here.') },
    '/home/messages'(event)      { showPlaceholder('messages',      'Messages',      'Read and reply to team messages here.') },
    '/home/notifications'(event) { showPlaceholder('notifications', 'Notifications', 'Review your alerts and notifications here.') },
    '/home/settings'(event)      { showPlaceholder('settings',      'Settings',      'Adjust application settings and preferences here.') },
})

function showPlaceholder(nodeId, title, message) {
    w2ui.main_sb.select(nodeId)
    w2ui.app_layout.html('main', `
        <div class="w2ui-centered" style="justify-content: center; text-align: center; color: gray">
            <div>
                <div style="font-size: 22px; color: #555; margin-bottom: 14px">${title}</div>
                <div style="font-size: 16px">${message}</div>
            </div>
        </div>`)
}
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