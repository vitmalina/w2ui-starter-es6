# w2ui-starter-es6

`Work in progress... not ready yet`

This repo is small, modular, easily extensible starting point to build apps with `w2ui` and `ES6 Modules`. Only modern browsers (ever-green and Safari 13+) support ES6 modules natively.

The purpose of this repo is to  provide structure. It is a front-end framework, so, no server side code included. There are a few static json files for you to play with. I have included latest jQuery and w2ui in the `src/libs` folder.

## File Structure

Clone github repository and open /src folder. This is where all front-end code is. You will find the following strucutre:

```
/app            - all front-end code is here
  /less         - global less files
  /icons        - svg files for icons and generated icon font
  /main         - layout and main menus
    global.css  - global css
    global.less - global less
    router.js   - tiny router, see description below
    routers.js  - for auto loading modules
    start.js    - starting point <--- START HERE
/libs           - 3d prath libs
index.html      - basic html
```

Open index.html in your browser and enjoy

## Gulp

Gulp is the task runner that can watch changes. It will compile you LESS files, icon-font and bundle up your application. If you run gulp without params it will compile LESS files in place. You can also run

```sh
gulp dev       # start watching .less and .svg files
gulp build     # bundles project into /build folder
```

# Getting Started

Open `src/app/index.html` in the browser to see the app. The index file is minimal and provides generic structure for the applications layout, includes all necessary JS libraries and global css files.

All application logic start with `src/app/start.js` file. You can see annotated version of that file below.

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
The wild card `*` can be used only here to trigger module whenever any module route is called. When defining routes, howeever, you can not use `*` wild card, but you can use variables in the route, for example
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

# ES 6 Modules

To create a new module, you need to do 2 things.

### 1. Create Module File

Create a folder in `src/app` directory and name it `mod1`. Then create a file `mod1.js` in that directory with the following content.
```js
import router from '../router.js'

router.add({
    "/mod1"(event) {
        w2ui.app_layout.html('left', w2ui.main_sidebar)
    }
})
router.process()

export default {}
```

I exported empty object, but you can export whatever you need.

### 2. Register a Route for Auto Load

Change `src/app/routes.js` to included your route.
```js
export default {
    "/home*": "app/main/main.js",
    "/mod1*": "app/mod1/mod1.js"
}
```
Navigate to `index.html#/mod1` and your modules will be loaded and route event triggered.

# Router

The `app.router` is part of the boiler plater and immediately available. It allows to lazy-load `ES6` modules.

### *app.router.add(route, callBack)*
Adds a route. You can add multiple at the same time if you pass an object to `add` method, where key is the route and value is its callBack

```js
import router from './router.js'

// single route
router.add("/home", (route, params) => {
    console.log(route, params);
})

// many routes at once
router.add({
    // exact route
    "/home"(route, params) {
        console.log(route, params);
    },
    // wild card route
    "/home/*"(route, params) {
        console.log(route, params);
    },
    // route with variables
    "/home/:id/view/:class"(route, params) {
        console.log(route, params);
    }
})
```

### router.get()
Returns currnet route.

### router.go(route)
Navigate to the route and triggers change enent.
```js
import router from './router.js'
...

router.go('/my/new/route')
```

### router.init([defaultRoute])
Initializes router module and sets defaultRoute. Used once in `app/start.js`

### router.list()
Returns all registered routes.

### router.remove(route)
Removes specified route.

### router.set(route)
Sets route silently without triggering change events.

## Events
Events are only available is you include w2ui as it takes them from w2utils.

### router.on('add', callBack)
Event that is triggered when a new route is added. Callback function will receive an event object with additional information.
```js
import router from './router.js'

router.on('add', (event) => {
  console.log('A new route is added', event)
})
```

### router.on('remove', callBack)
Event that is triggered when a route is removed. Callback function will receive an event object with additional information.

### router.on('route', callBack)
Event that is triggered when a route is processed. Callback function will receive an event object with additional information
```js
import router from './router.js'

router.on('route', (event) => {
  console.log('A route just got triggered', event)
})
```
