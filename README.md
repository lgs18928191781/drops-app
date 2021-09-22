# 初始模板

- 集成 metaidJs 登录逻辑
- 集成兼容 APP,打点登录
- 集成自适应（使用设计稿 px,自动转换 rem）
- 集成`i18n`国际化多语言配置
- 集成`element-plus`Ui 组件
- 集成代码格式规范和编辑器自动格式化

## 使用

1. 修改`.env`的`VITE_Design_Size`,`VITE_Min_FontSize`的自适应配置

## VSCode 设置

1. 安装推荐插件
   `code --install-extension dbaeumer.vscode-eslint esbenp.prettier-vscode johnsoncodehk.volar lihuiwang.vue-alias-skip formulahendry.auto-close-tag formulahendry.auto-rename-tag ms-ceintl.vscode-language-pack-zh-hans irongeek.vscode-env lokalise.i18n-ally kisstkondoros.vscode-gutter-preview ionutvmi.path-autocomplete`
2. 打开`settings.json` 确保开启保存自动格式化`"editor.formatOnSave": true,`
