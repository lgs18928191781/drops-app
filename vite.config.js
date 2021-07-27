import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import styleImport from 'vite-plugin-style-import'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { svgBuilder } from './svgBuilder'
export default (({mode}) => {
  console.log('mode')
  console.log(mode)
  // 加载环境配置文件
  // const env = require('dotenv').config({ path: `./.env.${mode}` });
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
      vue(),
      // element-plus 按需加载
      styleImport({
        libs: [{
          libraryName: 'element-plus',
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            name = name.slice(3)
            return `element-plus/packages/theme-chalk/src/${name}.scss`;
          },
          resolveComponent: (name) => {
            return `element-plus/lib/${name}`;
          },
        }]
      }),
      // 多语言加载
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,
  
        // you need to set i18n resource including paths !
        include: path.resolve(__dirname, './src/languages/**')
      }),
      svgBuilder('./src/assets/svg/')
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      _APP_VERSION: JSON.stringify(pkg.version),
    },
    server: {
      host: env.VITE_Hosts.replace(/https:\/\//, '').replace(/http:\/\//, ''),
      // host: '0.0.0.0',
      port: 443,
      https: true,
      open: false,
      // proxy: {
      //   '/api/showMANDB': {
      //     target: env.VITE_WalletApi,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   },
      // }
    },
    build: {
      target: 'es2015'
    }
  })
})
