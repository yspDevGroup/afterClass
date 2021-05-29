import ProFormFields from "@/components/ProFormFields";
import type { FormInstance } from "antd";
import React from "react";
import type { Maintenance } from "../data";

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

type PropsType = {
  current?: Maintenance;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
};


const TimePeriodForm = (props: PropsType) => {
  const { current, setForm } = props;
  const formItems: any[] = [
    {
      type: 'input',
      hidden: true,
      name: 'id',
      key: 'id',

    },
    {
      type: 'input',
      label: '时段名称',
      name: 'SDMC',
      key: 'SDMC',
      rules: [{ required: true, message: '请填写名称' }],
    },
    {
      type: 'dateRange',
      label: '日期',
      name: 'KSSJ',
      key: 'KSSJ',
      width: '100%',
      rules: [{ required: true, messsage: '请填写日期' }]
    },
    {
      type: 'input',
      label: '备注',
      name: 'BZ',
      key: 'BZ',
    },
  ];
  return (
    <>
      <ProFormFields
        layout="horizontal"
        setForm={setForm}
        values={current}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </>
  )
}
export default TimePeriodForm