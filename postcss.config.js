const env = require('dotenv').config().parsed
module.exports = {
  plugins: {
    // css前缀自动补全
    autoprefixer: {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
        'last 10 versions', // 所有主流浏览器最近10版本用
      ],
    },
    'postcss-nesting': {},
    // 自动把px 转化为 rem
    'postcss-pxtorem': {
      rootValue: parseInt(env.VITE_Design_Size) / 10, // 设计稿宽度 / 10
      propList: ['*'],
      replace: false,
      mediaQuery: false,
      minPixelValue: parseInt(env.VITE_Min_FontSize),
      unitPrecision: 5,
    },
  },
}
