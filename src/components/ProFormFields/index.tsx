import type { FC } from 'react';
import React, { useEffect } from 'react';
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
import type { FormItemsProps, ProFormFieldsPropsType } from './indexType';
import { Col, Form, Row, Space } from 'antd';
import UploadImage from './components/UploadImage';

const renderFormItems = (formItems: FormItemsProps[]) => {
  return formItems.map((formItem: FormItemsProps) => {
    const { type, key, groupItems, span, flex, cascaderItem, lineItem, ...currentProps } = formItem;

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
      case 'uploadImage':
        return (
          <ProForm.Item {...currentProps} key={key}>
            <UploadImage {...currentProps} key={key} />
          </ProForm.Item>
        );
      case 'cascader':
        return (
          <ProForm.Item {...currentProps} key={key}>
            <Space style={{ width: '100%' }}>
              {cascaderItem?.map((item: any) => {
                return renderFormItems([item]);
              })}
            </Space>
          </ProForm.Item>
        );
      case 'div':
        return (
          <div style={{ display: 'flex', height: 40 }} key={key}>
            <div>{formItem.label}</div>
            <div style={{ marginTop: -6 }}>
              {lineItem?.map((item: any) => {
                return renderFormItems([item]);
              })}
            </div>
          </div>
        );
      case 'divTab':
        return <div style={formItem.style}>{formItem.text}</div>;
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
      case 'custom':
        return (
          <ProForm.Item label={formItem.text} name="dataSource">
            {formItem.children}
          </ProForm.Item>
        );
      case 'reactnode':
        return (
          <ProForm.Item label={formItem.label} key={key} {...currentProps}>
            {formItem.children}
          </ProForm.Item>
        );
      case 'empty':
      default:
        return '';
    }
  });
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
