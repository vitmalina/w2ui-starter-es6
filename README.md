# w2ui-starter-es6

This repo is small, modular, easily extensible starting point to build apps with `w2ui` and `ES6 Modules`. Only modern browsers (ever-green: [latest, chrome, edge, firefox] and Safari 13+) support ES6 modules natively.

The purpose of this repo is to  provide structure. It is a front-end framework, only few basic node based API files included.  I have included latest jQuery and w2ui in the `src/libs` folder.

To get going:
```
npm install
npm start
```

## File Structure

Your app should live in `/src` folder. This is where all front-end code is. You will find the following strucutre:

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

## Gulp

Gulp is the task runner that can watch changes. It will compile you LESS files, icon-font and bundle up your application. If you run gulp without params it will compile LESS files in place. You can also run

```sh
gulp dev       # start watching .less and .svg files
gulp build     # bundles project into /build folder
```

(Getting Started)[docs/getting-started.md]
(ES6 Modules)[docs/es6-modules.md]
(Router)[docs/router.md]