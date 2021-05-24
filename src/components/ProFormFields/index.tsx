import type { FC } from 'react';
import React, { useEffect } from 'react';
import type { SubmitterProps } from '@ant-design/pro-form/lib/components/Submitter';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormDatePicker,
  ProFormCheckbox,
  ProFormDigit,
  ProFormSwitch,
  ProFormDateTimePicker,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormTimePicker,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Col, Form, Row } from 'antd';

type formItemsProps = {
  /** 表单项的类型 */
  type: string;
  /** 表单项的key */
  key: string;
  /** 表单的数组项 */
  groupItems: any[];
  /** 表单的栅格布局（请参考antd的栅格API） */
  span: string;
  /** 表单的栅格布局（请参考antd的栅格API） */
  flex: string;
  /** 表单的栅格布局（请参考antd的栅格API） */
  gutter: [number, number];
  /** 与 select 相同，根据 options 生成子节点 */
  options: any[];
  /** 每个表单项的属性，详情请参考ProForm的API */
  currentProps: Record<string, any>;
};

const renderFormItems = (formItems: formItemsProps[]) => {
  return formItems.map((formItem: formItemsProps) => {
    const { type, key, groupItems, span, flex, ...currentProps } = formItem;
    switch (type) {
      case 'input':
        return <ProFormText {...currentProps} key={key} />;
      case 'textArea':
        return <ProFormTextArea {...currentProps} key={key} />;
      case 'password':
        return <ProFormText.Password {...currentProps} key={key} />;
      case 'select':
        return <ProFormSelect {...currentProps} key={key} />;
      case 'radio':
        return <ProFormRadio.Group {...currentProps} key={key} />;
      case 'checkbox':
        return <ProFormCheckbox.Group {...currentProps} key={key} />;
      case 'inputNumber':
        return <ProFormDigit {...currentProps} key={key} />;
      case 'switch':
        return <ProFormSwitch {...currentProps} key={key} />;
      case 'date': // 日期
        return <ProFormDatePicker {...currentProps} key={key} />;
      case 'dateWeek': // 周
        return <ProFormDatePicker.Week {...currentProps} key={key} />;
      case 'dateMonth': // 月
        return <ProFormDatePicker.Month {...currentProps} key={key} />;
      case 'dateYear': // 年
        return <ProFormDatePicker.Year {...currentProps} key={key} />;
      case 'dateTime': // 日期时间
        return <ProFormDateTimePicker {...currentProps} key={key} />;
      case 'dateRange': // 日期区间
        return <ProFormDateRangePicker {...currentProps} key={key} />;
      case 'dateTimeRange': // 日期时间区间
        return <ProFormDateTimeRangePicker {...currentProps} key={key} />;
      case 'time': // 时间
        return <ProFormTimePicker {...currentProps} key={key} />;
      case 'timeRange': // 时间区间
        return <ProFormTimePicker.RangePicker {...currentProps} key={key} />;
      case 'group': {
        const colW = 24 / (groupItems ? groupItems.length : 1);
        return (
          <Row gutter={typeof formItem.gutter === 'undefined' ? 10 : formItem.gutter} key={key}>
            {groupItems?.map((item: any) => {
              const wInfo: {
                span?: number | string;
                flex?: number | 'none' | 'auto' | string;
                push?: number;
              } = {};
              if (item.hidden) {
                wInfo.span = 0;
              } else if (item.span) {
                wInfo.span = item.span;
              } else if (item.flex) {
                wInfo.flex = item.flex;
              } else if (item.push) {
                wInfo.push = item.push;
              } else {
                wInfo.span = colW;
              }
              // eslint-disable-next-line no-param-reassign
              item.style = { ...item.style, flexWrap: 'nowrap' };
              return (
                <Col {...wInfo} key={item.key}>
                  {renderFormItems([item])}
                </Col>
              );
            })}
          </Row>
        );
      }
      case 'empty':
      default:
        return '';
    }
  });
};

type ProFormFieldsPropsType = {
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

const ProFormFields: FC<ProFormFieldsPropsType> = ({
  initialValues = undefined,
  layout = 'horizontal',
  onFinish,
  formItems,
  setForm,
  formItemLayout,
  submitter = false,
  values = {},
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (typeof setForm === 'function') {
      setForm(form);
    }
    if (values) {
      form.setFieldsValue(values);
    }
  }, [form, setForm, values]);

  return (
    <div>
      <ProForm
        {...formItemLayout}
        layout={layout} // horizontal | vertical | inline
        form={form}
        submitter={submitter}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        {renderFormItems(formItems)}
      </ProForm>
    </div>
  );
};

export default ProFormFields;
