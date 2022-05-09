# Chrome Extension Boilerplate

Chrome插件模板

> 模板参考https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite

## 开发者指南

- yarn dev  
  修改 index.html 中的脚本为开发对应脚本，然后执行`yarn dev`

- yarn build  
  生成构建脚本，然后用 chrome 加载已解压的拓展程序引入 dist 文件

## Why vite.config2.ts

因为 rollup 对于被复用的模块，会将其打包成一个 common chunk，而其他的模块会通过 import 引入。
而 chrome 插件里并没有 esm 这种 import 的方式，所以会报错。

> rollup 相关 issue: https://github.com/rollup/rollup/issues/2756

公共的模块不单单指本项目中的 src/pages/content/shared 目录，也包括 preact 这种会在多个 content 中去使用的模块。对于这个问题，官方并没有解决方案，也没有要去解决的想法。  
故在此，只能提供 2 个 vite-config，分别打包 2 个 content-script，来保证单独构建。

### 注意

- 后续构建设置`emptyOutDir`为`false`，避免再次打包清除 dist 文件夹
- 后续构建设置`format`为 iife，如果不设置，即采用默认方案（esm），页面执行时会声明多次公共模块，从而出现报错。用 iife 可形成函数作用域，避免报错
> 首次构建采用默认方案（esm)，因为background不支持esm，里面引用了chrome模块。如果设置iife，构建会出现报错iife不支持code split(代码拆分)
