import router from './router.js'

let app = {
    name: 'MyApp',
    context: '../',
    router
}

// if localhost, then clear
let loc = String(document.location)
if (loc.substr(0, 5) != 'file:' && loc.substr(0, 16) != 'http://localhost') app.context = ''

router.init('/home')

window.app = app
export default app