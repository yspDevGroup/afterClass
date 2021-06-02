import ProFormFields from "@/components/ProFormFields";
import { getAllKHKCLX } from "@/services/after-class/khkclx";
import { createKHKCSJ, updateKHKCSJ } from "@/services/after-class/khkcsj";
import type { ActionType } from "@ant-design/pro-table/lib/typing";
import { message } from "antd";
import { Button, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import type { classType } from "../data";


type PropsType = {
    current?: classType;
    onClose?: () => void;
    readonly?: boolean;
    visible?: boolean;
    actionRef?: React.MutableRefObject<ActionType | undefined>;
  };
  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  
  

const NewCourses=(props: PropsType)=>{
    const { current,onClose,visible, actionRef} = props;
    const [options, setOptions] = useState<any[]>([]);
    const [form, setForm] = useState<any>();
    useEffect(() => {
      const res = getAllKHKCLX({name: ''})
      Promise.resolve(res).then((data)=>{
        if(data.status === 'ok'){
          const opt: any[] = []
          data.data?.map((item: any) => {
           return opt.push({ 
              label: item.KCLX,
              value: item.id
            })
          })
          setOptions(opt);
        }
      })
    }, [])
    const handleSubmit = () => {
      form.submit();
    };
    const onFinish = (values: any) =>{
      new Promise((resolve, reject) => {
        let res = null;
        if (current?.id) {
          const params = {
            id: current?.id,
          };
          const optionse = values;
          res =  updateKHKCSJ(params, optionse);
        } else {
          res = createKHKCSJ(values);
        }
        resolve(res);
        reject(res);
      })
        .then((data: any) => {
          if (data.status === 'ok') {
            message.success('保存成功');
            onClose!();
            actionRef?.current?.reload();
          } else {
            message.error('保存失败');
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
    
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
          name: 'KCLXId',
          key: 'KCLXId',
          options
 
        },
        {
          type: 'textArea',
          label: '备 注',
          name: 'KCMS',
          key: 'KCMS',
        },
        {
          type: 'uploadImage',
          label: '封面：',
          name: 'KCTP',
          key: 'KCTP',
          upurl: '',
          // imageurl: current?.KCTP,
        },
      ];
    return(
        <>
         <Drawer
        title="新增课程"
        width={480}
        onClose={onClose}
        visible={visible}
        destroyOnClose={true}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 16 }}>
              取消
            </Button>
            <Button onClick={handleSubmit} type="primary">
              保存
            </Button>
          </div>
        }
      >
       <ProFormFields
        layout="horizontal"
        setForm={setForm}
        onFinish={onFinish}
        values={(()=>{
          if(current){
            const {KHKCLX, ...info } =current;
            return {
              KCLXId :KHKCLX?.id,
              ...info
            };
          }
        return undefined ;} 
        )()}
        formItems={formItems}
        formItemLayout={formLayout}
      />
      </Drawer>
        </>
    )
}

export default NewCourses