## HeaderSearch 头部搜索框

一个带补全数据的输入框，支持收起和展开 Input

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from 'antd';
import React from 'react';
import HeaderSearch from '@/components/HeaderSearch';

export default () => {
  return (
    <HeaderSearch
      placeholder="站内搜索"
      defaultValue="umi ui"
      options={[
        { label: 'Ant Design Pro', value: 'Ant Design Pro' },
        {
          label: 'Ant Design',
          value: 'Ant Design',
        },
        {
          label: 'Pro Table',
          value: 'Pro Table',
        },
        {
          label: 'Pro Layout',
          value: 'Pro Layout',
        },
      ]}
      onSearch={(value) => {
        console.log('input', value);
      }}
    />
  );
};
```

### API

| 参数            | 说明                               | 类型                         | 默认值 |
| --------------- | ---------------------------------- | ---------------------------- | ------ |
| value           | 输入框的值                         | `string`                     | -      |
| onChange        | 值修改后触发                       | `(value?: string) => void`   | -      |
| onSearch        | 查询后触发                         | `(value?: string) => void`   | -      |
| options         | 选项菜单的的列表                   | `{label,value}[]`            | -      |
| defaultVisible  | 输入框默认是否显示，只有第一次生效 | `boolean`                    | -      |
| visible         | 输入框是否显示                     | `boolean`                    | -      |
| onVisibleChange | 输入框显示隐藏的回调函数           | `(visible: boolean) => void` | -      |
