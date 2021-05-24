/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { FormInstance } from 'antd';
import type { RoomItem } from '../data';
import ProFormFields from '@/components/ProFormFields';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

type PropsType = {
  current?: RoomItem | null;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
  readonly?: boolean;
};

const AddRoom = (props: PropsType) => {
  const { setForm, readonly } = props;

  const onFinish = (values: any) => {
    console.log('onFinish', values);
  };
  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      label: '场地名称',
      name: 'a',
      key: 'a',
    },
    {
      type: 'input',
      readonly,
      label: '场地类型',
      name: 'b',
      key: 'b',
    },
    {
      type: 'input',
      readonly,
      label: '所属校区',
      name: 'c',
      key: 'c',
    },
    {
      type: 'input',
      readonly,
      label: '容纳人数',
      name: 'd',
      key: 'd',
    },
    {
      type: 'input',
      readonly,
      label: '场地地址',
      name: 'e',
      key: 'e',
    },
    {
      type: 'textArea',
      readonly,
      label: '备 注',
      name: 'f',
      key: 'f',
    },
  ];
  return (
    <>
      <ProFormFields
        layout="horizontal"
        onFinish={onFinish}
        setForm={setForm}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </>
  );
};

export default AddRoom;
