import ProFormFields from "@/components/ProFormFields";
import type { FormInstance } from "@ant-design/pro-form";
import React from "react";
import type { classType } from "../data";


type PropsType = {
    current?: classType;
    onCancel?: () => void;
    setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
    readonly?: boolean;
  };
  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  
  

const NewCourses=(props: PropsType)=>{
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
          label: '名称',
          name: 'KCMC',
          key: 'KCMC',
        },
        {
          type: 'select',
          label: '课程类型',
          name: 'KHKCLX',
          key: 'KHKCLX',
            valueEnum:{
                china: 'China',
                usa: 'U.S.A',
              }
 
        },
        {
          type: 'textArea',
          label: '备 注',
          name: 'BJMS',
          key: 'BJMS',
        },
      ];
    return(
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

export default NewCourses