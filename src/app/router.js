import modules from './routes.js'
import { w2base } from '../libs/w2ui/w2ui.es6.min.js'

class Router extends w2base {
    constructor() {
        super()
        this.routes = {}
        this.routeRE = {}
        this.verbose = true
        this.onAdd = null
        this.onRemvoe = null
        this.onRoute = null
        // add listeners
        if (window.addEventListener) {
            window.addEventListener('hashchange', this.process.bind(this), false)
        } else {
            window.attachEvent('onhashchange', this.process.bind(this))
        }
    }

    init(route) {
        // default route is passed here
        if (this.get() === '') {
            this.go(route)
        } else {
            this.process()
        }
    }

    add(route, handler) {
        let edata
        if (typeof route == 'object') {
            Object.keys(route).forEach(r => {
                let tmp = String('/'+ r).replace(/\/{2,}/g, '/')
                this.routes[tmp] = route[r]
            })
            return router
        }
        route = String('/'+route).replace(/\/{2,}/g, '/')
        // if events are available
        if (typeof router.trigger == 'function') {
            edata = router.trigger('add', { target: 'self', route: route, handler: handler })
            if (edata.isCancelled === true) return false
        }
        // default behavior
        this.routes[route] = handler
        // if events are available
        if (typeof router.trigger == 'function') edata.finish()
        return router
    }

    remove(route) {
        let edata
        route = String('/'+route).replace(/\/{2,}/g, '/')
        // if events are available
        if (typeof router.trigger == 'function') {
            edata = router.trigger('remove', { target: 'self', route: route })
            if (edata.isCancelled === true) return false
        }
        // default behavior
        delete this.routes[route]
        delete this.routeRE[route]
        // if events are available
        if (typeof router.trigger == 'function') edata.finish()
        return router
    }

    go(route) {
        route = String('/'+route).replace(/\/{2,}/g, '/')
        window.history.replaceState({}, document.title, '#' + route)
        this.process()
        return router
    }

    set(route) {
        route = String('/'+route).replace(/\/{2,}/g, '/')
        window.history.replaceState({}, document.title, '#' + route)
        return router
    }

    get() {
        return window.location.hash.substr(1).replace(/\/{2,}/g, '/')
    }

    info() {
        let matches = []
        // match this.routes
        let hash = window.location.hash.substr(1).replace(/\/{2,}/g, '/')
        if (hash == '') hash = '/'

        Object.keys(this.routeRE).forEach(r => {
            let params = {}
            let tmp = this.routeRE[r].path.exec(hash)
            if (tmp != null) { // match
                let i = 1
                for (let p in this.routeRE[r].keys) {
                    params[this.routeRE[r].keys[p].name] = tmp[i]
                    i++
                }
                // default handler
                matches.push({ name: r, path: hash, params: params })
            }
        })
        return matches
    }

    list() {
        this.prepare()
        let res = {}
        Object.keys(this.routes).forEach(r => {
            let tmp = this.routeRE[r].keys
            let keys = []
            Object.keys(tmp).forEach(t => {
                keys.push(tmp[t].name)
            })
            res[r] = keys
        })
        return res
    }

    process() {
        this.prepare()
        // match this.routes
        let hash = window.location.hash.substr(1).replace(/\/{2,}/g, '/')
        if (hash == '') hash = '/'
        // process route
        let isFound = false
        let isExact = false
        let isAutoLoad = false
        Object.keys(this.routeRE).forEach(r => {
            let params = {}
            let tmp = this.routeRE[r].path.exec(hash)
            let edata
            if (tmp != null) { // match
                isFound = true
                if (!isExact && r.indexOf('*') === -1 && r.indexOf('/:') === -1) {
                    isExact = true
                }
                let i = 1
                for (let p in this.routeRE[r].keys) {
                    params[this.routeRE[r].keys[p].name] = tmp[i]
                    i++
                }
                // if events are available
                if (typeof router.trigger == 'function') {
                    edata = router.trigger('route', { target: 'self', route: r, params: params })
                    if (edata.isCancelled === true) return false
                }
                // default handler
                if (this.routes && typeof this.routes[r] == 'function') {
                    this.routes[r]({ name: r, path: hash, params: params }, params)
                }
                // if events are available
                if (typeof router.trigger == 'function') edata.finish()
                // if hash changed (for example in handler), then do not process rest of old processings
                let current = window.location.hash.substr(1).replace(/\/{2,}/g, '/')
                if (hash !== current) return
            }
        })
        // find if a route matches a module route
        if (!isExact) {
            Object.keys(modules).forEach(route => {
                let obj = this
                let mod = { route: route, path: modules[route] }
                let rt = mod.route
                if (rt != null) {
                    if (typeof rt == 'string') rt = [rt]
                    if (Array.isArray(rt)) {
                        rt.forEach((str) => { checkRoute(str) })
                    }
                }
                function checkRoute(str) {
                    obj.routeRE = obj.routeRE || {}
                    if (obj.routeRE[str] == null) obj.routeRE[str] = obj.prepare(str)
                    if (!mod.ready && str && obj.routeRE[str].path.exec(hash)) {
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
                            child.onerror = (event) => {
                                let edata = router.trigger('error', { target: 'self', hash: hash, originalEvent: event, 404: true })
                                if (edata.isCancelled === true) return false
                                // if events are available
                                edata.finish()
                            }
                            if (router.verbose) console.log(`ROUTER: Auto Load Module "${mod.path}" for path "${mod.route}"`)
                            document.head.appendChild(child)
                        }
                        return
                    }
                }
            })
        }
        if (!isAutoLoad && !isFound) {
            let edata = router.trigger('error', { target: 'self', hash: hash })
            if (edata.isCancelled === true) return false
            // if events are available
            edata.finish()
        }
        if (!isAutoLoad && router.verbose) {
            // path not found
            if (!isExact) {
                console.log(`ROUTER: Exact route for "${hash}" not found`)
            }
            if (!isFound) {
                console.log(`ROUTER: Wild card route for "${hash}" not found`)
            }
        }
    }

    prepare(r) {
        if (r != null) {
            return _prepare(r)
        }
        // make sure all this.routes are parsed to RegEx
        for (let r in this.routes) {
            if (this.routeRE[r]) continue
            this.routeRE[r] = _prepare(r)
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
}

let router = new Router()
export default router