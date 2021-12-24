/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-20 16:58:57
 * @LastEditTime: 2021-12-20 17:07:31
 * @LastEditors: Wu Zhan
 */
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button, message, Spin } from 'antd';

import { getClassStudents } from '@/services/after-class/bjsj';
import { getKHFWBJ, studentRegistration } from '@/services/after-class/khfwbj';
import moment from 'moment';

type SignUpClassProps = {
  BJSJId: string;
  XNXQId: string;
  // 课后辅导
  SelectKCFD?: any[];
  // 课后课程
  SelectKHKC?: any[];
  type: number; // 0 保存并批量报名 1 批量报名 2, 代报名 代选课
  // KHFWSJPZId?: string;
  actionRef: any;
  XSJBSJId?: string;
  title?: string;
  setXSId?: any;
};
export type SelectType = {
  label: string;
  value: string;
  data?: string;
};
//  服务班课程批量学生报名
const SignUpClass = (props: SignUpClassProps, ref: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [KCFDData, setKCFDData] = useState<SelectType[]>();
  const [KHKCData, setKHKCData] = useState<SelectType[]>();
  const [studentsData, setStudentsData] = useState<SelectType[]>();
  const [KXSL, setKXSL] = useState<number>();
  const [KHFWBJId, setKHFWBJId] = useState<string>();
  const [KHFWSJPZIdData, setKHFWSJPZIdData] = useState<SelectType[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    onSetVisible: (value: boolean) => {
      setVisible(value);
    },
  }));

  const formRef = useRef();
  const { type, XNXQId, BJSJId, actionRef, XSJBSJId, title, setXSId } = props;

  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  const getXH = (XH: string) => {
    if (XH !== null && XH.length > 4) {
      return `~${XH.substring(XH.length - 4)}`;
    } else {
      return `~ ${XH}`;
    }
  };

  // 获取学生
  const getStudentData = async () => {
    if (BJSJId && XNXQId) {
      const res = await getClassStudents({ BJSJId, XNXQId });
      if (res.status === 'ok') {
        console.log('res', res);
        const { rows } = res.data;
        const students: SelectType[] = rows.map((item: any) => {
          return { label: `${item.XM}${getXH(item.XH)}`, value: item?.id,  };
        });
        setStudentsData(students);
      }
    }
  };

  // 获取课程
  const getDetailValue = async () => {
    setLoading(true);
    const res = await getKHFWBJ({
      BJSJId,
      XNXQId,
    });
    if (res.status === 'ok') {
      const KCFD: any = [];
      const KHKC: any = [];
      const newKHFWSJPZIdData: any = [];
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
        // 课后课程选择数据
        if (KHKC.length) {
          setKHKCData(KHKC);
        }
        // 时段数据
        data?.KHFWSJPZs?.forEach((item: any) => {
          newKHFWSJPZIdData.push({ label: `${item.KSRQ} ~ ${item.JSRQ}`,
          value: item.id});
        });
        if (newKHFWSJPZIdData.length) {
          formRef?.current?.setFieldsValue({
           
            KHFWSJPZIds:newKHFWSJPZIdData.map((item: SelectType) => item.value)
          });
          setKHFWSJPZIdData(newKHFWSJPZIdData);

        }
        // 课后辅导数据
        if (KCFD?.length) {
          setKCFDData(KCFD);
          formRef?.current?.setFieldsValue({
            KHFWSJIds: KCFD.map((item: SelectType) => item.value),
           
          });
        }

        // 限制数据
        if (data?.KXSL) {
          setKXSL(data.KXSL);
        }
        // 服务班id
        setKHFWBJId(data.id);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      getStudentData();
      getDetailValue();
    } else {
      // type ===2 情况下移除 选定的学生
      if (setXSId) {
        setXSId(undefined);
      }
    }
  }, [visible]);

  const onFinish = async (values: any) => {
    if (KHFWBJId) {
      setLoading(true);
      let KHBJSJIds: any = [];
      if (values?.KHFWSJIds) {
        KHBJSJIds = KHBJSJIds.concat(values.KHFWSJIds);
      }
      if (values?.KHBJSJIds) {
        KHBJSJIds = KHBJSJIds.concat(values.KHBJSJIds);
      }
      const params: any = {
        ZT: 3,
        KHFWBJId,
        KHFWSJPZIds: values?.KHFWSJPZIds,
        XSJBSJIds: values?.XSJBSJIds,
        KHBJSJIds,
      };
      // 班级详情下 学生批量报名存在时段
      // if (type !== 0 && KHFWSJPZId) {
      //   params.KHFWSJPZId = KHFWSJPZId;
      // }
      if (type === 2) {
        params.XSJBSJIds = [XSJBSJId];
      }
      const res = await studentRegistration(params);
      if (res.status === 'ok') {
        if(title==='代选课'&& type===2){
          message.success('选课成功')
        }else{
          message.success('报名成功');
        }
        actionRef.current?.reloadAndRest();
      } else {
        message.error(res.message);
      }
      setVisible(false);
      setLoading(false);
    }
    return true;
  };

  return (
    <Spin spinning={loading}>
      <ModalForm
        formRef={formRef}
        title={title || '批量报名'}
        visible={visible}
        trigger={
          (type === 1 && (
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              批量报名
            </Button>
          )) ||
          undefined
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
            setVisible(false);
          },
        }}
        onFinish={onFinish}
        layout="horizontal"
        {...formLayout}
      >
        {
          // 保存并批量报名需要选择时段
         
            <ProFormSelect
              placeholder="选择报名时段"
              label="报名时段"
              rules={[{ required: true, message: '请选择学生报名' }]}
              name="KHFWSJPZIds"
              fieldProps={{ options: KHFWSJPZIdData,mode:"multiple",disabled: true }}
            />
        
        }
        {
          //  保存并批量报名 || 批量报名
          type != 2 && (
            <ProFormSelect
              placeholder="请选择学生"
              label="报名学生"
              rules={[{ required: true, message: '请选择学生报名' }]}
              name="XSJBSJIds"
              fieldProps={{ options: studentsData, mode: 'multiple' }}
            />
          )
        }

        {KCFDData?.length && (
          <ProFormSelect
            placeholder="请选择辅导班"
            label="课后辅导"
            rules={[{ required: true, message: '请选择辅导课程' }]}
            name="KHFWSJIds"
            fieldProps={{ options: KCFDData, mode: 'multiple', disabled: true }}
          />
        )}
        {KHKCData?.length && (
          <ProFormSelect
            placeholder="请选择课程班"
            label="课后课程"
            rules={[
              { required: title === '代选课', message: '请选择课后课程' },
              { type: 'array', max: KXSL, message: `课后课程储量不能超过${KXSL}` },
            ]}
            name="KHBJSJIds"
            fieldProps={{ options: KHKCData, mode: 'multiple' }}
          />
        )}
      </ModalForm>
    </Spin>
  );
};

export default forwardRef(SignUpClass);
