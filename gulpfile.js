const gulp = require('gulp')
const { exec } = require('child_process')
const header = require('gulp-header')
const iconfont = require('gulp-iconfont')
const less = require('gulp-less')
// const uglify = require('gulp-uglify')

let tasks = {

    clean(cb) {
        let commands = [
            'rm -rf build/'
        ]
        exec(commands.join('; '), (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            cb()
        })
    },

    build(cb) {
        let commands = [
            'mkdir -p build', // only when does not exist
            'tar -czf build/build.tar.gz api src/app src/libs src/index.html '
        ]
        exec(commands.join('; '), (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            cb()
        })
    },

    less(cb) {
        // all *.less in each modeule
        return gulp
            .src(['src/**/*.less', '!src/less/*.less'])
            .pipe(less({ cleancss : true }))
            .on('error', function (err) {
                console.log(err.toString())
                this.emit('end')
            })
            .pipe(header('/* generated file, do not change */\n'))
            .pipe(gulp.dest('src'))
    },

    watch(cb) {
        gulp.watch(['src/**/*.less'], tasks.less)
        gulp.watch('src/icons/svg/*.svg', tasks.icons)
    },

    icons(cb) {
        let fs = require('fs')
        let css = '@font-face {\n' +
                  '    font-family: "icon-font";\n' +
                  '    src: url("icon-font.woff?'+ (new Date()).getTime() +'");\n' +
                  '    font-weight: normal;\n' +
                  '    font-style: normal;\n' +
                  '}\n' +
                  '[class^="icon-"]:before,\n' +
                  '[class*=" icon-"]:before {\n' +
                  '    font-family: "icon-font";\n' +
                  '    display: inline-block;\n' +
                  '    vertical-align: middle;\n' +
                  '    line-height: 1;\n' +
                  '    font-weight: normal;\n' +
                  '    font-style: normal;\n' +
                  '    speak: none;\n' +
                  '    text-decoration: inherit;\n' +
                  '    text-transform: none;\n' +
                  '    text-rendering: optimizeLegibility;\n' +
                  '    -webkit-font-smoothing: antialiased;\n' +
                  '    -moz-osx-font-smoothing: grayscale;\n' +
                  '}\n'
        let html = '<!doctype html>\n'+
                   '<html>\n'+
                   '<head>\n'+
                   '    <meta charset="utf-8">\n'+
                   '    <link href="icon-font.css" rel="stylesheet">\n'+
                   '    <title>icon-font</title>\n'+
                   '    <style>\n'+
                   '        body { font-family: verdana; font-size: 13px }\n'+
                   '        .preview { padding: 8px; margin: 4px; width: 200px; box-shadow: 1px 1px 2px #ccc; float: left } \n'+
                   '        .preview:hover { background-color: #f5f5f5 } \n'+
                   '        .preview span.icon { font-size: 16px; padding: 8px }\n'+
                   '    </style>\n' +
                   '</head>\n'+
                   '<body>\n'+
                   '    <h1 style="font-family: arial; padding-left: 15px;">icon-font $count</h1>'
        let json = []

        return gulp.src(['src/icons/svg/*.svg'])
            .pipe(iconfont({
                fontName: 'icon-font',
                formats: ['woff'],
                fontHeight: 1500,
                normalize: true,
                fixedWidth: true,
                centerHorizontally: true,
                timestamp: Math.round(Date.now()/1000)
            }))
            .on('error', function (err) {
                this.emit('end')
            })
            .on('glyphs', function(icons, options) {
                icons = icons.sort((a, b) => (a.name > b.name) - (a.name < b.name)) // need reorder f series
                icons.forEach((icon, i) => {
                    let unicode = icon.unicode
                    html += '<div class="preview">\n'+
                            '   <span class="icon icon-'+ icons[i].name +'"></span>\n'+
                            '   <span>icon-'+ icons[i].name +'</span>\n'+
                            '</div>\n'
                    css += '.icon-'+ icons[i].name + ':before { content: "\\' + unicode.toString(16) + '" }\n'
                    json.push(icons[i].name)
                })

                html += '<div style="clear: both; height: 10px;"></div></body>\n</html>'
                html = html.replace('$count', ' - ' + icons.length + ' icons')
                fs.writeFileSync('src/icons/icon-font.css', css)
                fs.writeFileSync('src/icons/preview.html', html)
                fs.writeFileSync('src/icons/icons.json', JSON.stringify(json))
            })
            .pipe(gulp.dest('src/icons/'))
    }
}

exports.default = gulp.series(tasks.clean, tasks.less)
exports.dev = tasks.watch
exports.less = tasks.less
exports.icons = tasks.icons
exports.build = gulp.series(tasks.clean, tasks.less, tasks.build)
