import ProFormFields from '@/components/ProFormFields';
import type { FormInstance } from '@ant-design/pro-form';
import type { ActionType } from '@ant-design/pro-table';
import React from 'react';
import type { TermItem } from '../data';

type PropsType = {
  current?: TermItem;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
  readonly?: boolean;
  onClose: () => void;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
};
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const OrganizationTable = (props: PropsType) => {
  const { current, setForm, readonly } = props;
  const onFinish = () => {};

  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      label: '学年',
      name: 'XN',
      key: 'XN',
      rules: [
        { required: true, message: '请填写学年' },
        { max: 10, message: '最长为 10 位' },
      ],
      fieldProps: {
        autocomplete: 'off',
        placeholder: '如2021-2022',
      },
    },
    {
      type: 'select',
      readonly,
      label: '学期',
      name: 'XQ',
      key: 'XQ',
      rules: [{ required: true, message: '请选择学期' }],
      valueEnum: {
        第一学期: '第一学期',
        第二学期: '第二学期',
      },
    },
    {
      type: 'dateRange',
      readonly,
      label: '日期',
      name: 'KSRQ',
      key: 'KSRQ',
      rules: [{ required: true, message: '请选择日期' }],
      width: '100%',
    },
  ];

  return (
    <div>
      <ProFormFields
        layout="horizontal"
        onFinish={onFinish}
        setForm={setForm}
        values={(() => {
          if (current) {
            const { KSRQ, ...info } = current;
            const cc = [];
            cc.push(current.KSRQ);
            cc.push(current.JSRQ);
            return {
              KSRQ: cc,
              ...info,
            };
          }
          return undefined;
        })()}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </div>
  );
};

export default OrganizationTable;
