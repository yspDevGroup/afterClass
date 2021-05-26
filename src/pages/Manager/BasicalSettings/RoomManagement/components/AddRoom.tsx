/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { FormInstance } from 'antd';
import type { RoomItem } from '../data';
import ProFormFields from '@/components/ProFormFields';
import { RoomType, SchoolArea } from '@/constant';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

type PropsType = {
  current?: RoomItem;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
  readonly?: boolean;
};

const AddRoom = (props: PropsType) => {
  const { current, setForm, readonly } = props;

  const onFinish = (values: any) => {
    console.log('onFinish', values);
  };
  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      label: '场地名称',
      name: 'FJMC',
      key: 'FJMC',
      rules: [{ required: true, message: '请填写场地名称' }],
    },
    {
      type: 'select',
      readonly,
      label: '场地类型',
      name: 'FJLX',
      key: 'FJLX',
      rules: [{ required: true, message: '请填写场地名称' }],
      valueEnum: RoomType,
    },
    {
      type: 'select',
      readonly,
      label: '所属校区',
      name: 'SSXQ',
      key: 'SSXQ',
      rules: [{ required: true, message: '请填写场地名称' }],
      valueEnum: SchoolArea,
    },
    {
      type: 'input',
      readonly,
      label: '容纳人数',
      name: 'FJRS',
      key: 'FJRS',
      rules: [{ required: true, message: '请填写场地名称' }],
    },
    {
      type: 'input',
      readonly,
      label: '场地地址',
      name: 'CDDZ',
      key: 'CDDZ',
      rules: [{ required: true, message: '请填写场地名称' }],
    },
    {
      type: 'textArea',
      readonly,
      label: '备 注',
      name: 'BZ',
      key: 'BZ',
    },
  ];
  return (
    <>
      <ProFormFields
        layout="horizontal"
        onFinish={onFinish}
        setForm={setForm}
        values={current}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </>
  );
};

export default AddRoom;
