---
title: PC页面容器
sidemenu: true
---

## PageContainer 页面容器组件

这个组件将ant Pro 的配置根据UI调整为项目所需样式，允许配置cls类名，在页面中单独定制样式

```tsx
/**
 * background: '#f0f2f5'
 */
import React from 'react';
import PageContainer from '@/components/PageContainer';

export default () => <PageContainer cls={pageWrapper} >{children}</PageContainer>;
```
