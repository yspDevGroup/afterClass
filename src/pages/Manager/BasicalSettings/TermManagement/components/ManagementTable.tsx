import React, { useEffect } from 'react';
import { DatePicker, Form, Input, Select } from 'antd';
import type { FormInstance } from '@ant-design/pro-form';
import type { TermItem } from '../data';
import moment from 'moment';
import { useModel } from 'umi';

type PropsType = {
  current?: TermItem;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
};

const { RangePicker } = DatePicker;
const { Option } = Select;
const OrganizationTable = (props: PropsType) => {
  const { current, setForm } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [form] = Form.useForm();
  useEffect(() => {
    if (typeof setForm === 'function') {
      setForm(form);
    }
  }, [form, setForm]);
  return (
    <div>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={(() => {
          if (current) {
            const { KSRQ, XN, ...info } = current;
            const xn = XN.split(/-/g);
            return {
              RQ: [moment(current.KSRQ), moment(current.JSRQ)],
              XNs: [moment(xn?.[0]), moment(xn?.[1])],
              ...info,
            };
          }
          return {
            XXJBSJId: currentUser?.xxId,
          };
        })()}
        autoComplete="off"
      >
        <Form.Item label="id" name="id" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item label="XXJBSJId" name="XXJBSJId" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item label="学年" name="XNs" rules={[{ required: true, message: '请选择学年!' }]}>
          <RangePicker style={{ width: '100%' }} picker="year" />
        </Form.Item>
        <Form.Item label="学期" name="XQ" rules={[{ required: true, message: '请选择学期!' }]}>
          <Select style={{ width: '100%' }}>
            <Option value="第一学期">第一学期</Option>
            <Option value="第二学期">第二学期</Option>
          </Select>
        </Form.Item>
        <Form.Item label="日期" name="RQ" rules={[{ required: true, message: '请选择日期!' }]}>
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrganizationTable;
