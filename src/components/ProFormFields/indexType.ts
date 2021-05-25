import type { SubmitterProps } from '@ant-design/pro-form/lib/components/Submitter';
import type { FormInstance } from 'antd';

export type FormItemsProps = {
  /** 表单项的类型 */
  type?:
    | 'input' // 输入框
    | 'textArea' // 多行输入框
    | 'password' // 密码输入框
    | 'select' // 选择框
    | 'radio' // 单选
    | 'checkbox' // 多选
    | 'inputNumber' // 数字输入框
    | 'switch' // 开关
    | 'date' // 日期
    | 'dateWeek' // 周
    | 'dateMonth' // 月
    | 'dateYear' // 年
    | 'dateTime' // 日期时间
    | 'dateRange' // 日期区间
    | 'dateTimeRange' // 日期时间区间
    | 'time' // 时间
    | 'timeRange' // 时间区间
    | 'uploadImage' // 上传
    | 'group'
    | 'empty';
  /** 表单项的key */
  key: string;
  /** 表单的数组项 */
  groupItems?: any[];
  /** 表单的栅格布局（请参考antd的栅格API） */
  span?: string;
  /** 表单的栅格布局（请参考antd的栅格API） */
  flex?: string;
  /** 表单的栅格布局（请参考antd的栅格API） */
  gutter?: [number, number];
  /** 与 select 相同，根据 options 生成子节点 */
  options: any[];
  /** 每个表单项的属性，详情请参考ProForm的API */
  currentProps?: Record<string, any>;
};

export type ProFormFieldsPropsType = {
  /** 默认值 */
  initialValues?: Record<string, any>;

  /** 布局样式 */
  formItemLayout?: {
    labelCol: {
      span?: number | string;
      flex?: number | 'none' | 'auto' | string;
    };
    wrapperCol: {
      span?: number | string;
      flex?: number | 'none' | 'auto' | string;
    };
  };

  /** 支持水平的 | 垂直的 | 内联的 */
  layout?: 'horizontal' | 'vertical' | 'inline';

  /** 提交表单且数据验证成功后回调事件 */
  onFinish: (value: any) => any;

  formItems: any;
  /** 提交按钮相关配置(请参考ProForm的API) */
  submitter?: false | SubmitterProps<{ form?: FormInstance<any> | undefined }>;

  /** 外部按钮获取form表单对象的方法 */
  setForm?: (value: any) => void;
  /** 表单的初始值 */
  values?: Record<string, any>;
};
