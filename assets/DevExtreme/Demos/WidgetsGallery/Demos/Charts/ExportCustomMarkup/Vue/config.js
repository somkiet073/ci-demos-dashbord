System.config({  transpiler: 'plugin-babel',  meta: {    '*.vue': {      loader: 'vue-loader'    },  },  paths: {    'npm:': 'https://unpkg.com/'  },  map: {    'vue': 'npm:vue@2.6.3/dist/vue.esm.browser.js',    'vue-loader': 'npm:dx-systemjs-vue-browser@latest/index.js',    'stackblur-canvas': 'npm:stackblur-canvas',    'rgbcolor': 'npm:rgbcolor',    'canvg': 'npm:canvg@2/dist/browser/canvg.min.js',    'devextreme': 'npm:devextreme@20.1',    'devextreme-vue': 'npm:devextreme-vue@20.1',    'jszip': 'npm:jszip@3.1.3/dist/jszip.min.js',    'quill': 'npm:quill@1.3.7/dist/quill.js',    'devexpress-diagram': 'npm:devexpress-diagram@1.0.5',    'devexpress-gantt': 'npm:devexpress-gantt@1.0.3',    'plugin-babel': 'npm:systemjs-plugin-babel@0/plugin-babel.js',    'systemjs-babel-build': 'npm:systemjs-plugin-babel@0/systemjs-babel-browser.js'  },  packages: {    'devextreme-vue': {      main: 'index.js'    },    'devextreme': {      defaultExtension: 'js'    },    'devextreme/events/utils': {      main: 'index'    },    'devextreme/events': {        main: 'index'    },  },  babelOptions: {    sourceMaps: false,    stage0: true  }});