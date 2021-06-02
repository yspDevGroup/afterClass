import ProFormFields from "@/components/ProFormFields"
import React from "react"

const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

const ClassStart=()=>{
    
    const formItems: any[] =[
        {
            type:'date',
            label:'报名时间',
            name:'starttime',
            key:'starttime',
            width:'100%'
        },
        {
            type:'inputNumber',
            label:'报名人数',
            name:'applicants',
            key:'applicants',
            fieldProps:{
                min:0
            }
        }
]
    return (
        <>
        <ProFormFields
        formItems={formItems}
        layout='horizontal'
        formItemLayout={formLayout}
        />
        </>
    )
}
export default ClassStart