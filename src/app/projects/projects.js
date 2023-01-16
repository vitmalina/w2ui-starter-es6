import conf from './conf.js'
import main_conf from '../main/conf.js'
import { query, w2ui, w2grid, w2sidebar } from '../../libs/w2ui/w2ui.es6.min.js'
import '../main/main.js'

let project_sb = new w2sidebar(Object.assign(conf.project_sb, main_conf.sb_proto))
let projects = new w2grid(conf.projects)

app.router.add({
    '/projects*'(event) {
        w2ui.app_layout.html('left', project_sb)
        w2ui.app_tb.uncheck(...w2ui.app_tb.get())
        w2ui.app_tb.check('projects')
    },
    '/projects'(event) {
        w2ui.project_sb.select('projects')
        w2ui.app_layout.html('main', projects)
    }
})
app.projects = {}

export default app.projects