# 初始模板

- 集成 metaidJs 登录逻辑
- 集成兼容 APP,打点登录
- 集成自适应（使用设计稿 px,自动转换 rem）
- 集成`i18n`国际化多语言配置
- 集成`element-plus`Ui 组件,tempalte 里面直接使用，不用引入。script 使用需单独引入
- 集成代码格式规范和编辑器自动格式化
- 集成 PWA(2021-01-13)
- 使用 Vue3 最新 SFC setup 语法，推荐使用[https://vue3js.cn/docs/zh/guide/composition-api-setup.html#%E5%8F%82%E6%95%B0](https://vue3js.cn/docs/zh/guide/composition-api-setup.html#%E5%8F%82%E6%95%B0)
- 添加 App 环境参数在`store.state`里面`isAndroid: boolean,isIOS: boolean` [2021-12-16]
- 添加 NFT 全局组件，可以直接使用`<UserAvatar :meta-id="metaId" :type="type" />` [2020-03-28][使用webcomponent实现](http://gitlab2.showpay.top/front-end/show-web-components)
- `sdk类方法`
  - changeSdkType // 更改 sdk 环境类型
  - initSdk // 初始化 sdk
  - toWallet // 跳转钱包
  - login // 跳转登陆授权
  - getToken // code 换 token
  - refreshToken // 刷新 token
  - getUserInfo // 获取用户信息
  - sendMetaDataTx // 节点上链
  - eciesDecryptData // 解密
  - getBalance // 获取用户余额
  - createMetaFileProtocol // 文件上链
  - getSensibleTxData // 获取 SensibleTx 数据
  - createNFT // 铸造 nft
  - genesisNFT // 创建 nft 系列
  - checkUserCanIssueNft // 检测用户是否可以铸造 nft
  - issueNFT // 同 metaidjs issueNFT
  - nftBuy // nft 购买
  - nftSell // nft 上架/销售
  - nftCancel // nft 下架/取消销售
  - getMc // 获取用户 MC 余额
  - queryFindMetaData // showman queryFindMetaData
  - queryFindMetaDataForPost // showman queryFindMetaDataForPost
- 集成常用工具类方法在`sdk`包,例如:`import { hexToase64 } from 'sdk'`
  - hexToBase64 // hex 格式转为 Base64
  - toTxLink // 跳转 https://whatsonchain.com/tx/${txId}
  - fileToMetaFile // 文件转为`MetaFile` 格式，便于后续处理附件, `MetaFile`格式`{base64Data, BufferData, hexData, name, data_type, raw(File)}`
  - setAttachments // 处理附件, 第一个参数为`data`, `data`里面的文件必须为`MetaFile` 格式，第二个字段为要处理的字段和是否加密`{ name: string; encrypt: string }[]`，最终返回处理过的`data`和`attachments`供`sendMetaDataTx`使用

## 使用

1. 修改`.env`的`VITE_Design_Size`的自适应配置,`VITE_AppName`:应用名称;`VITE_AppDescription`:应用描述
2. 修改 publice 目录下对应图标
3. 修改对应环境配置的`VITE_AppId`,`VITE_AppSecret`,`VITE_Hosts`,网页回调地址为`VITE_Hosts` + `/login`
4. 图标推荐使用 svg 格式, `import` 引入使用, 使用方法[vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader)
5. 布局推荐使用`flex`,`flex`全局快捷样式查看`/src/assets//styles/flex.scss`
6. 卸载旧的浏览器`Vue.js devtools`插件，安装最新版本[https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg)
7. 页面标题统一在`router.ts`路由文件，根据`meta.title`字段配置，通过配置`meta.isAuth`字段是否需要登录才可访问
8. 页面是否缓存,统一在`router.ts`路由文件，根据`meta.keepAlive`字段配置

## VSCode 设置

1. 安装推荐插件
   `code --install-extension michelemelluso.code-beautifier dbaeumer.vscode-eslint esbenp.prettier-vscode johnsoncodehk.volar lihuiwang.vue-alias-skip formulahendry.auto-close-tag formulahendry.auto-rename-tag ms-ceintl.vscode-language-pack-zh-hans irongeek.vscode-env lokalise.i18n-ally kisstkondoros.vscode-gutter-preview ionutvmi.path-autocomplete`

2. 删除或禁用`vetur`插件

3. 打开`settings.json`
   ```json
   {
     "editor.formatOnSave": true, // 确保开启保存自动格式化
     "[javascript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[scss]": {
       "editor.defaultFormatter": "michelemelluso.code-beautifier"
     },
     "[json]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[typescript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[markdown]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[less]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[vue]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     }
   }
   ```
4. 添加 Vue 代码片段，快速生产 vue 初始模板

   - 【设置】
     选择“文件 -> 首选项 -> 用户代码片段”，此时，会弹出一个搜索框，输入 vue，选择 vue 后，编辑器会自动打开一个名字为 vue.json 的文件

     输入以下代码片段保存

     ```json
     {
       // Place your snippets for vue here. Each snippet is defined under a snippet name and has a prefix, body and
       // description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
       // $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the
       // same ids are connected.
       // Example:
       // "Print to console": {
       //     "prefix": "log",
       //     "body": [
       //         "console.log('$1');",
       //         "$2"
       //     ],
       //     "description": "Log output to console"
       // }
       "Print to console": {
         "prefix": "vue",
         "body": [
           "<template>",
           "  <div>$0",
           "     template",
           "  </div>",
           "</template>\n",
           "<script setup lang=\"ts\">",
           "</script>\n",
           "<style lang=\"scss\" scoped>",
           "</style>",
           "$2"
         ],
         "description": "Log output to console"
       }
     }
     ```

   - 【使用】
     新建 vue 文件，输入 vue 回车即可
