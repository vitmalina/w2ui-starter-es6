import conf from './conf.js'
import prefs from './prefs.js'

$().w2toolbar(conf.app_toolbar)
$().w2layout(conf.app_layout)
$().w2sidebar(conf.main_sidebar)
$().w2grid(conf.main_grid)

// display
$('#app-toolbar').w2render('app_toolbar')
$('#app-main').w2render('app_layout')
$('#app-container').fadeIn(50)

app.router.add({

    '/home*'(event) {
        w2ui.app_layout.html('left', w2ui.main_sidebar)
    },

    '/home'(event) {
        w2ui.main_sidebar.select('home')
        w2ui.app_layout.html('main', w2ui.main_grid)
    },

    '/home/projects'(event) {
        w2ui.main_sidebar.select('projects')
        w2ui.app_layout.html('main', `
            <div class="w2ui-centered" style="font-size: 16px; color: gray">
                You can refresh this page, it will still come to this sidebar item
            </div>`)
    }
})
app.main = { prefs }
app.main.prefs.init({
    "ui-sidebar-size":"large"
})
app.router.process()

export default app.main