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
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import inject from '@rollup/plugin-inject'
import stdLibBrowser from 'node-stdlib-browser'
import { viteExternalsPlugin } from 'vite-plugin-externals'

export default ({ mode }) => {
  // 加载环境配置文件
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
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
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
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
        bsv: 'bsv',
        bip39: 'bip39',
        '@sensible-contract/bsv': 'bsv',
        'bsv/ecies': 'ECIES',
        'bsv/mnemonic': 'Mnemonic',
        'sensible-sdk': 'sensible',
      }),
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
      // port: 443,
      // https: true,
      // open: false,
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
