# afterClass

中小学课后服务系统--前端

## 关于 openapi 脚本生成的接口文件多一个 params 参数的问题

请检查 [源码](node_modules@umijs\openapi\dist\serviceGenerator.js) 第 455 行，把

```js
templateParams['path'] = templateParams['path'] || [];
```

移入下面的 where 循环内最终结果为

```js
if (path && path.length > 0) {
  var regex = /\{(\w+)\}/g;
  // templateParams['path'] = templateParams['path'] || [];
  let match = null;
  while ((match = regex.exec(path))) {
    templateParams['path'] = templateParams['path'] || [];
    if (!templateParams['path'].some((p) => p.name === match[1])) {
      templateParams['path'].push(
        Object.assign(Object.assign({}, DEFAULT_PATH_PARAM), { name: match[1] }),
      );
    }
  }
}
```

## 启动脚本

```bash
# 连接远程服务器（49.233.193.39）进行开发
npm start

# 连接局域网后台(127.0.0.17)进行开发
npm run dev

# 编译打包
npm run build

# 同步后台API
npm run openapi
```
