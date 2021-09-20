# Getting Started

Starting point is `src/app/index.html. The index file is minimal and provides generic structure for the applications layout, includes all necessary JS libraries and global css files.

All application logic start with `src/app/start.js`, which is loaded as ES6 module. You can see annotated version of that file below.

```js
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
```

## App Variable

I like to expose `app` as a global variable, but it is up to you. I find it easier to debug and troubleshoot the application. Modules are lazy-loaded, which means they do not get all loaded on start. You may define a route pattern for the module and it will auto-load when pattern triggers (one time).

See `app/routes.js`.
```js
export default {
    "/home*": "app/main/main.js" // load when path starts with #/home
}
````

The wild card `*` can be used only here to trigger module whenever any module route is called. While defining routes, howeever, you can not use `*`, but you can use variables in the route, for example
```js
import route from './router.js'

router.add({
    "/home/:mod/view/:section"(event) {
        console.log(event)
    }
 })
 // this route will trigger for all of the following
 // - /home/mod1/view/main
 // - /home/users/view/1
 // - /home/some-other-module/view/some-id
```

See more:
- [Router](router.md)
- [ES6 Modules](es6-modules.md)
