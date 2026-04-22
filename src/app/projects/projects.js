import conf from './conf.js'
import main_conf from '../main/conf.js'
import projectSummary from './project-summary.js'
import { w2ui, w2grid, w2sidebar } from '../../libs/w2ui/w2ui.es6.min.js'
import '../main/main.js'

let project_sb = new w2sidebar(Object.assign(conf.project_sb, main_conf.sb_proto))
let projects = new w2grid(conf.projects)

function showPlaceholder(nodeId, title, message) {
    w2ui.project_sb.select(nodeId)
    w2ui.app_layout.html('main', `
        <div class="w2ui-centered" style="justify-content: center; text-align: center; color: gray">
            <div>
                <div style="font-size: 22px; color: #555; margin-bottom: 14px">${title}</div>
                <div style="font-size: 16px">${message}</div>
            </div>
        </div>`)
}

app.router.add({
    '/projects*'(event) {
        w2ui.app_layout.html('left', project_sb)
        w2ui.app_layout.hide('right', true)
        w2ui.app_tb.uncheck(...w2ui.app_tb.get())
        w2ui.app_tb.check('projects')
    },

    '/projects'(event) {
        let node = w2ui.project_sb.get(w2ui.project_sb.selected)
        if (node && node.route) {
            app.router.go(node.route)
        } else {
            app.router.go('/projects/overview')
        }
    },

    '/projects/overview'(event) {
        w2ui.project_sb.select('pg-overview')
        let promise = w2ui.app_layout.html('main',
            '<div id="projects-summary-host" class="projects-summary-host" ' +
            'style="width:100%;height:100%;overflow:auto;"></div>')
        if (promise && typeof promise.removed == 'function') {
            promise.removed(() => projectSummary.destroy())
        }
        requestAnimationFrame(() => {
            let host = document.getElementById('projects-summary-host')
            if (host) projectSummary.render(host)
        })
    },

    '/projects/list'(event) {
        w2ui.project_sb.select('pg-list')
        w2ui.app_layout.html('main', projects)
    },

    '/projects/milestones'(event) {
        showPlaceholder('pg-milestones', 'Milestones', 'Plan major phases and key dates, then track them against the schedule. This placeholder can become a gantt or milestone list.')
    },
    '/projects/board'(event) {
        showPlaceholder('pg-board', 'Board', 'A Kanban-style board for moving work through stages. Wire this to your task backend when the project is ready for it.')
    },
    '/projects/timeline'(event) {
        showPlaceholder('pg-timeline', 'Timeline', 'Visualize work over time and spot overlaps or gaps in the plan.')
    },
    '/projects/team'(event) {
        showPlaceholder('pg-team', 'Team', 'Assign people to projects, see roles, and open collaboration tools from one place.')
    },
    '/projects/files'(event) {
        showPlaceholder('pg-files', 'Files & documents', 'Store specs, design files, and shared documents, with version notes when you add storage integration.')
    },
    '/projects/settings'(event) {
        showPlaceholder('pg-settings', 'Project settings', 'Set defaults, naming, integrations, and permissions for the projects area.')
    }
})
app.projects = {}

export default app.projects