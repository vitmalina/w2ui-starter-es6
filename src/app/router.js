import modules from './routes.js'

let routes = {},
    routeRE = {}

let router = {
    verbose: true,
    init,
    add,
    remove,
    go,
    set,
    get,
    info,
    process,
    list,
    onAdd: null,
    onRemvoe: null,
    onRoute: null
}

// mised in event handling
if (typeof w2utils != 'undefined') {
    Object.assign(router, w2utils.event, { handlers: [] })
}
addListener()
export default router

function init(route) {
    // default route is passed here
    if (get() === '') {
        go(route)
    } else {
        process()
    }
}

function add(route, handler) {
    let edata
    if (typeof route == 'object') {
        Object.keys(route).forEach(r => {
            let tmp = String('/'+ r).replace(/\/{2,}/g, '/')
            routes[tmp] = route[r]
        })
        return router
    }
    route = String('/'+route).replace(/\/{2,}/g, '/')
    // if events are available
    if (typeof router.trigger == 'function') {
        edata = router.trigger({ phase: 'before', type: 'add', target: 'self', route: route, handler: handler })
        if (edata.isCancelled === true) return false
    }
    // default behavior
    routes[route] = handler
    // if events are available
    if (typeof router.trigger == 'function') router.trigger(Object.assign(edata, { phase: 'after' }))
    return router
}

function remove(route) {
    let edata
    route = String('/'+route).replace(/\/{2,}/g, '/')
    // if events are available
    if (typeof router.trigger == 'function') {
        edata = router.trigger({ phase: 'before', type: 'remove', target: 'self', route: route })
        if (edata.isCancelled === true) return false
    }
    // default behavior
    delete routes[route]
    delete routeRE[route]
    // if events are available
    if (typeof router.trigger == 'function') router.trigger(Object.assign(edata, { phase: 'after' }))
    return router
}

function go(route) {
    route = String('/'+route).replace(/\/{2,}/g, '/')
    window.history.replaceState({}, document.title, '#' + route)
    process()
    return router
}

function set(route) {
    route = String('/'+route).replace(/\/{2,}/g, '/')
    window.history.replaceState({}, document.title, '#' + route)
    return router
}

function get() {
    return window.location.hash.substr(1).replace(/\/{2,}/g, '/')
}

function info() {
    let matches = []
    // match routes
    let hash = window.location.hash.substr(1).replace(/\/{2,}/g, '/')
    if (hash == '') hash = '/'

    Object.keys(routeRE).forEach(r => {
        let params = {}
        let tmp = routeRE[r].path.exec(hash)
        if (tmp != null) { // match
            let i = 1
            for (let p in routeRE[r].keys) {
                params[routeRE[r].keys[p].name] = tmp[i]
                i++
            }
            // default handler
            matches.push({ name: r, path: hash, params: params })
        }
    })
    return matches
}

function list() {
    prepare()
    let res = {}
    Object.keys(routes).forEach(r => {
        let tmp = routeRE[r].keys
        let keys = []
        Object.keys(tmp).forEach(t => {
            keys.push(tmp[t].name)
        })
        res[r] = keys
    })
    return res
}

function process() {
    prepare()
    // match routes
    let hash = window.location.hash.substr(1).replace(/\/{2,}/g, '/')
    if (hash == '') hash = '/'
    // process route
    let isFound = false
    let isExact = false
    let isAutoLoad = false
    Object.keys(routeRE).forEach(r => {
        let params = {}
        let tmp = routeRE[r].path.exec(hash)
        let edata
        if (tmp != null) { // match
            isFound = true
            if (!isExact && r.indexOf('*') === -1 && r.indexOf('/:') === -1) {
                isExact = true
            }
            let i = 1
            for (let p in routeRE[r].keys) {
                params[routeRE[r].keys[p].name] = tmp[i]
                i++
            }
            // if events are available
            if (typeof router.trigger == 'function') {
                edata = router.trigger({ phase: 'before', type: 'route', target: 'self', route: r, params: params })
                if (edata.isCancelled === true) return false
            }
            // default handler
            routes[r]({ name: r, path: hash, params: params }, params)
            // if events are available
            if (typeof router.trigger == 'function') router.trigger(Object.assign(edata, { phase: 'after' }))
            // if hash changed (for example in handler), then do not process rest of old processings
            let current = window.location.hash.substr(1).replace(/\/{2,}/g, '/')
            if (hash !== current) return
        }
    })
    // find if a route matches a module route
    if (!isExact) {
        Object.keys(modules).forEach(route => {
            let mod = { route: route, path: modules[route] }
            let rt = mod.route
            if (rt != null) {
                if (typeof rt == 'string') rt = [rt]
                if (Array.isArray(rt)) {
                    rt.forEach((str) => { checkRoute(str) })
                }
            }
            function checkRoute(str) {
                mod.routeRE = mod.routeRE || {}
                if (mod.routeRE[str] == null) mod.routeRE[str] = prepare(str)
                if (!mod.ready && str && mod.routeRE[str].path.exec(hash)) {
                    // add file as a module
                    let isLoaded = false
                    document.querySelectorAll('script').forEach(node => {
                        if (node.type == 'module' && node.path === mod.path) isLoaded = true
                    })
                    if (!isLoaded) {
                        isAutoLoad = true
                        let child = document.createElement('script')
                        child.type = 'module'
                        child.src = mod.path
                        child.path = mod.path
                        let attr = document.createAttribute('crossorigin')
                        attr.value = 'use-credentials' // makes Safari 13 pass cookies
                        child.setAttributeNode(attr)
                        child.onload = (event) => { router.go(router.get()) }
                        document.head.appendChild(child)
                        if (router.verbose) console.log(`ROUTER: Auto Load Module "${mod.path}" for path "${mod.route}"`)
                    }
                    return
                }
            }
        })
    }
    if (!isAutoLoad && !isExact && router.verbose) console.log(`ROUTER: Exact route for "${hash}" not found`)
    let edata
    if (!isFound) {
        // path not found
        if (typeof router.trigger == 'function') {
            edata = router.trigger({ phase: 'before', type: 'error', target: 'self', hash: hash})
            if (edata.isCancelled === true) return false
        }
        if (!isAutoLoad && router.verbose) console.log(`ROUTER: Wild card route for "${hash}" not found`)
        // if events are available
        if (typeof router.trigger == 'function') router.trigger(Object.assign(edata, { phase: 'after' }))
    }
}

/*
*   Internal functions
*/

function prepare(r) {
    if (r != null) {
        return _prepare(r)
    }
    // make sure all routes are parsed to RegEx
    for (let r in routes) {
        if (routeRE[r]) continue
        routeRE[r] = _prepare(r)
    }

    function _prepare(r) {
        let keys = []
        let path = r
            .replace(/\/\(/g, '(?:/')
            .replace(/\+/g, '__plus__')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (_, slash, format, key, capture, optional) => {
                keys.push({ name: key, optional: !! optional })
                slash = slash || ''
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '')
            })
            .replace(/([/.])/g, '\\$1')
            .replace(/__plus__/g, '(.+)')
            .replace(/\*/g, '(.*)')
        return {
            path : new RegExp('^' + path + '$', 'i'),
            keys : keys
        }
    }
}

function addListener() {
    if (window.addEventListener) {
        window.addEventListener('hashchange', process, false)
    } else {
        window.attachEvent('onhashchange', process)
    }
}