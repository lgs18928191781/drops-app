# 初始模板

- 集成 metaidJs 登录逻辑
- 集成兼容 APP,打点登录
- 集成自适应（使用设计稿 px,自动转换 rem）
- 集成`i18n`国际化多语言配置
- 集成`element-plus`Ui 组件
- 集成代码格式规范和编辑器自动格式化
- 使用 Vue3 最新 SFC setup 语法，推荐使用[https://vue3js.cn/docs/zh/guide/composition-api-setup.html#%E5%8F%82%E6%95%B0](https://vue3js.cn/docs/zh/guide/composition-api-setup.html#%E5%8F%82%E6%95%B0)
- 集成常用工具类方法在`SDK`报,例如:`import { hexToase64 } from 'sdk'`
  - hexToase64 // hex 格式转为 Base64
  - toTxLink // 跳转 https://whatsonchain.com/tx/${txId}

## 使用

1. 修改`.env`的`VITE_Design_Size`,`VITE_Min_FontSize`的自适应配置

## VSCode 设置

1. 安装推荐插件
   `code --install-extension dbaeumer.vscode-eslint esbenp.prettier-vscode johnsoncodehk.volar lihuiwang.vue-alias-skip formulahendry.auto-close-tag formulahendry.auto-rename-tag ms-ceintl.vscode-language-pack-zh-hans irongeek.vscode-env lokalise.i18n-ally kisstkondoros.vscode-gutter-preview ionutvmi.path-autocomplete`

2. 删除或禁用`vetur`插件

3. 打开`settings.json`
   ```json
   {
     "editor.formatOnSave": true, // 确保开启保存自动格式化
     "[javascript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[scss]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
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
