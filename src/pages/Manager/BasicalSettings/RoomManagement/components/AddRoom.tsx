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
      name: 'CDMC',
      key: 'CDMC',
    },
    {
      type: 'input',
      readonly,
      label: '场地类型',
      name: 'CDLX',
      key: 'CDLX',
    },
    {
      type: 'input',
      readonly,
      label: '所属校区',
      name: 'SSXQ',
      key: 'SSXQ',
    },
    {
      type: 'input',
      readonly,
      label: '容纳人数',
      name: 'RNRS',
      key: 'RNRS',
    },
    {
      type: 'input',
      readonly,
      label: '场地地址',
      name: 'CDDZ',
      key: 'CDDZ',
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
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </>
  );
};

export default AddRoom;
