/** @type {import('vite').UserConfig} */
import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import svgLoader from 'vite-svg-loader'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import inject from '@rollup/plugin-inject'
import stdLibBrowser from 'node-stdlib-browser'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import basicSsl from '@vitejs/plugin-basic-ssl'
// import dns from 'dns'
// dns.setDefaultResultOrder('verbatim')
const pathSrc = path.resolve(__dirname, 'src')
const productionEnvs = ['prod', 'preview']
export default ({ mode, command }) => {
  // 加载环境配置文件
  const env = loadEnv(mode, process.cwd())
  const isProduction = productionEnvs.includes(mode) && command === 'build' ? true : false
  return defineConfig({
    plugins: [
      command === 'serve' &&
        nodePolyfills({
          include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
        }),
      {
        ...inject({
          global: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'global'],
          process: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'process'],
          Buffer: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'Buffer'],
        }),
        enforce: 'post',
      },
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.includes('show-'),
          },
        },
      }),
      // element-plus 按需加载
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ],
        dts: path.resolve(pathSrc, 'components.d.ts'),
      }),
      Icons({
        autoInstall: true,
      }),
      // 多语言加载
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: path.resolve(__dirname, './src/languages/**'),
      }),
      svgLoader(),
      VitePluginHtmlEnv(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',

        /**
         * 自定义插入位置
         * @default: body-last
         */
        // inject?: 'body-last' | 'body-first'

        /**
         * custom dom id
         * @default: __svg__icons__dom__
        //  */
        customDomId: '__svg__icons__dom__',
      }),
      viteExternalsPlugin({
        'mvc-lib': 'mvc',
        'mvc-lib/ecies': 'ECIES',
        'mvc-lib/mnemonic': 'Mnemonic',
        bip39: 'bip39',
      }),
      // basicSsl(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        ...stdLibBrowser,
      },
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
    },
    define: {
      _APP_VERSION: JSON.stringify(pkg.version),
    },
    server: {
      host: '0.0.0.0',
      port: 8080,

      https: false,
      // open: true,
      // proxy: {
      //   '^/metasv/': {
      //     target: 'https://192.168.168.147:443',
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/metasv/, ''),
      //   },
      // },
    },
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },
    build: {
      target: 'es2015',
      minify: isProduction,
      sourcemap: isProduction ? false : 'inline',
      rollupOptions: {
        plugins: [nodePolyfills()],
        output: {
          sourcemap: isProduction ? false : 'inline',
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    sourcemap: isProduction ? false : 'inline',
  })
}
