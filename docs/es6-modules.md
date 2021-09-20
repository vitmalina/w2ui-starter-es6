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
