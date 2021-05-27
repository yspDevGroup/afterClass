import ProFormFields from "@/components/ProFormFields";
import { RoomType } from "@/constant";
import type { FormInstance } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";
import React from "react";
import type { TermItem } from "../data";

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
  const onFinish = () => {
    
  };

  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      label: '学年',
      name: 'XN',
      key: 'XN',
      rules: [{ required: true, message: '请填写学年' }],
    },
    {
      type: 'input',
      readonly,
      label: '学期',
      name: 'XQ',
      key: 'XQ',
      rules: [{ required: true, message: '请填写学年' }],
      valueEnum: RoomType,
    },
    {
      type: 'date',
      readonly,
      label: '开始日期',
      name: 'KSRQ',
      key: 'KSRQ',
      rules: [{ required: true, message: '请填写学年' }],
    },
    {
      type: 'date',
      readonly,
      label: '结束日期',
      name: 'JSRQ',
      key: 'JSRQ',
      rules: [{ required: true, message: '请填写学年' }],
    },
  ];

  return (
    <div>
     <ProFormFields
        layout="horizontal"
        onFinish={onFinish}
        setForm={setForm}
        values={current}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </div>
  );
};

export default OrganizationTable;
