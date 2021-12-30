/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-20 16:58:57
 * @LastEditTime: 2021-12-20 17:07:31
 * @LastEditors: Wu Zhan
 */
import ProForm, { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button, message, Spin } from 'antd';
import { addKCtoKCFWBJ, getKHFWBJ } from '@/services/after-class/khfwbj';

import SelectCourses from '../components/SelectCourses';

type UpdateCoursesProps = {
  BJSJId: string;
  XNXQId: string|undefined;
  actionRef: any;
  NJSJ?: any;
  key: string;
  XQSJId: string;
};
export type SelectType = {
  label: string;
  value: string;
  data?: string;
};

const UpdateCourses = (props: UpdateCoursesProps, ref: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [KHFWBJId, setKHFWBJId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  // const [KXSL, setKXSL] = useState<number>();

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    onSetVisible: (value: boolean) => {
      setVisible(value);
    },
  }));

  const formRef = useRef();
  const { XNXQId, BJSJId, actionRef,NJSJ, key,XQSJId } = props;

  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };


  // 获取课程
  const getDetailValue = async () => {
    setLoading(true);
    if(BJSJId&&XNXQId){
      const res = await getKHFWBJ({
        BJSJId,
        XNXQId,
      });
      if (res.status === 'ok') {
        const KCFD: any = [];
        const KHKC: any = [];
        const { data } = res;
        if (data) {
          data?.KCFWBJs?.forEach((item: any) => {
            // 辅导班
            if (item.LX === 1) {
              KCFD.push({ label: item?.KHBJSJ?.BJMC, value: item?.KHBJSJ?.id });
            }
            // 课程班
            if (item?.LX === 0) {
              KHKC.push({ label: item?.KHBJSJ?.BJMC, value: item?.KHBJSJ?.id });
            }
          });
          // 限制数据
          // if (data?.KXSL) {
          //   setKXSL(data.KXSL);
          // }
          formRef?.current?.setFieldsValue({KCFD,KHKC});
         
          // 服务班id
          setKHFWBJId(data.id);
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (visible) {  
      getDetailValue();
    }
  }, [visible]);

  const onFinish = async (values: any) => {
    // addKCtoKCFWBJ

    setLoading(true);
    const KHBJSJIds: any[] = [];
    // 辅导 1
    if (values?.KCFD) {
      values?.KCFD?.forEach((item: any) => {
        KHBJSJIds.push({ KHBJSJId: item.value, LX: 1 });
      });
    }
    // 课程班 0
    if (values?.KHKC) {
      values?.KHKC?.forEach((item: any) => {
        KHBJSJIds.push({ KHBJSJId: item.value, LX: 0 });
      });
    }
   const res= await addKCtoKCFWBJ(
      {
        KHFWBJId: KHFWBJId,
        KHBJSJIds: KHBJSJIds,
      }
    )
    if(res.status==='ok'){
      message.success('修改成功');
      setVisible(false);
    }else{
      message.error(res.message)
      
    }
      
      setLoading(false);
      
    return false;
  };

  return (
    <Spin spinning={loading}>
      <ModalForm
        key={key}
        formRef={formRef}
        title={"选择课程"}
        visible={visible}
        trigger={
          (
            <a
              onClick={() => {
                setVisible(true);
              }}
            >
              选择课程
            </a>
          )
        }
        submitter={{
          searchConfig: {
            submitText: '保存',
            resetText: '取消',
          },

          render: (_props, defaultDoms) => {
            return [defaultDoms[1], defaultDoms[0]];
          },
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            actionRef?.current?.reloadAndRest();
            setVisible(false);
          },
        }}
        onFinish={onFinish}
        layout="horizontal"
        {...formLayout}
      >
       <ProForm.Item
          label="课后辅导："
          rules={[{ required: false, message: '请选择课后辅导班' }]}
          name="KCFD"
          key="KCFD"
        >
          <SelectCourses
            title="选择辅导班"
            maxLength={50}
            getNJArr={() => {
              // 获取年级
              if (NJSJ) {
                return [NJSJ?.id];
              }
              return [];
            }}
            XNXQId={XNXQId}
            XQSJId={XQSJId}
            // 课程班=0 辅导班=1
            flag={1}
          />
        </ProForm.Item>
        <ProForm.Item
          label="课后课程："
          rules={[
            { required: false, message: '请选择课程班' },
          // { type: 'array', max: KXSL, message: `课后课程数量不能超过${KXSL}` },
        ]}
          name="KHKC"
          key="KHKC"
        >
          <SelectCourses
            title="选择课程班"
            maxLength={50}
            getNJArr={() => {
              // 获取年级
              if (NJSJ) {
                return [NJSJ?.id];
              }
              return [];
            }}
            XNXQId={XNXQId}
            XQSJId={XQSJId}
            // 课程班=0 辅导班=1
            flag={0}
          />
        </ProForm.Item>
      </ModalForm>
    </Spin>
  );
};

export default forwardRef(UpdateCourses);
