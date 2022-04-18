import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import svgLoader from 'vite-svg-loader'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

export default ({ mode }) => {
  // 加载环境配置文件
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.includes('show-'),
          },
        },
      }),
      // element-plus 按需加载
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus(),
      // 多语言加载
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: path.resolve(__dirname, './src/languages/**'),
      }),
      svgLoader(),
      VitePluginHtmlEnv(),
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
      port: 443,
      https: true,
      open: false,
    },
    build: {
      target: 'es2015',
      minify: mode === 'prod' ? true : false,
      sourcemap: mode === 'prod' ? false : 'inline',
      rollupOptions: {
        output: {
          sourcemap: mode === 'prod' ? false : 'inline',
        },
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'prod',
          drop_debugger: mode === 'prod',
        },
      },
    },
    sourcemap: mode === 'prod' ? false : 'inline',
  })
}
