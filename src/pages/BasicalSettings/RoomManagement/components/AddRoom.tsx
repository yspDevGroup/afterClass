/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { FormInstance } from 'antd';
import type { TimeTableItem } from '../data';

const formLayout = {
  labelCol: { flex: '7em' },
  wrapperCol: { flex: 'auto' },
};

type PropsType = {
  current?: TimeTableItem | null;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
};

const AddTimeTable = (props: PropsType) => {
  return <>新增</>;
};

export default AddTimeTable;
