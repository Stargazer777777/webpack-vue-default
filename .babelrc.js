module.exports = {
  presets: [
    // ts预制
    [
      '@babel/preset-typescript',
      {
        allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
      },
    ],
    //将基础的ES6语法向下转译，兼容不同的浏览器
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3',
      },
    ],
  ],
  plugins: [
    // 转译高级的ES6语法
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    // 支持 ts 类的写法
    '@babel/plugin-proposal-class-properties',
  ],
};
