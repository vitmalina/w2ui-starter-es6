import conf from './conf.js'
import prefs from './prefs.js'
import { query, w2ui, w2toolbar, w2layout, w2sidebar, w2grid } from '../../libs/w2ui/w2ui.es6.min.js'

let app_layout = new w2layout(conf.app_layout)
let app_tb = new w2toolbar(conf.app_tb)
let main_sb = new w2sidebar(conf.main_sb)
let main_grid = new w2grid(conf.main_grid)

// display
app_tb.render(query('#app-toolbar')[0])
app_layout.render(query('#app-main')[0])
query('#app-container').show()

app.router.add({

    '/home*'(event) {
        w2ui.app_layout.html('left', main_sb)
        w2ui.app_tb.uncheck(...w2ui.app_tb.get())
        w2ui.app_tb.check('home')
    },

    '/home'(event) {
        w2ui.main_sb.select('home')
        w2ui.app_layout.html('main', main_grid)
    },

    '/home/projects'(event) {
        w2ui.main_sb.select('projects')
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