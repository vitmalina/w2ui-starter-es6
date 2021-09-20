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