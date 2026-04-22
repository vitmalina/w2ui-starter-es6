import router from './router.js'
import { w2ui, w2alert, w2utils } from '../../libs/w2ui/w2ui.es6.min.js'

let app = {
    name: 'MyApp',
    context: '../',
    router
}

// TODO: can be removed
window.w2ui = w2ui

w2utils.settings.recordHeight = 40

// if localhost, then clear
let loc = String(document.location)
if (loc.substr(0, 5) != 'file:' && loc.substr(0, 16) != 'http://localhost') app.context = ''

app.router.on('error', (event) => {
    w2alert(`Route "${event.detail.hash}" is not defined.`)
    app.router.go('/home/dashboard')
})
router.init('/home/dashboard')

window.app = app
export default app