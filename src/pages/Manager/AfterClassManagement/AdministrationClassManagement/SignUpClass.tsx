/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-20 16:58:57
 * @LastEditTime: 2021-12-20 17:07:31
 * @LastEditors: Wu Zhan
 */
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button, message } from 'antd';

import { getClassStudents } from '@/services/after-class/bjsj';
import { getKHFWBJ, studentRegistration } from '@/services/after-class/khfwbj';

type SignUpClassProps = {
  BJSJId: string;
  XNXQId: string;
  // 课后辅导
  SelectKCFD?: any[];
  // 课后课程
  SelectKHKC?: any[];
  type: number; // 0 保存并批量报名 1 批量报名
};
type SelectType = {
  label: string;
  value: string;
};
//  服务班课程批量学生报名
const SignUpClass = (props: SignUpClassProps, ref: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [KCFDData, setKCFDData] = useState<SelectType[]>();
  const [KHKCData, setKHKCData] = useState<SelectType[]>();
  const [studentsData, setStudentsData] = useState<SelectType[]>();
  const [KXSL, setKXSL] = useState<number>();
  const [KHFWBJId, setKHFWBJId] = useState<string>();

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    onSetVisible: (value: boolean) => {
      setVisible(value);
    },
  }));

  const formRef = useRef();
  const { type, XNXQId, BJSJId } = props;

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
          return { label: `${item.XM}${getXH(item.XH)}`, value: item?.id };
        });
        setStudentsData(students);
      }
    }
  };

  // 获取课程
  const getDetailValue = async () => {
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
          if (item.LX === 0) {
            KCFD.push({ label: item?.KHBJSJ?.BJMC, value: item?.KHBJSJ?.id });
          }
          if (item?.LX === 1) {
            KHKC.push({ label: item?.KHBJSJ?.BJMC, value: item?.KHBJSJ?.id });
          }
        });
        if (KCFD.length) {
          setKCFDData(KCFD);
          formRef?.current?.setFieldsValue({
            KHFWSJIds: KCFD.map((item: SelectType) => item.value),
          });
        }
        if (data?.KXSL) {
          setKXSL(data.KXSL);
        }
        setKHFWBJId(data.id);

        setKHKCData(KHKC);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      getStudentData();
      getDetailValue();
    }
  }, [visible]);

  const onFinish = async (values: any) => {
    if (KHFWBJId) {
      const res = await studentRegistration({
        ZT: 3,
        KHFWBJId,
        ...values,
      });
      if (res.status === 'ok') {
        message.success('报名成功');
      } else {
        message.error('报名失败');
      }
      setVisible(false);
    }
    return true;
  };

  return (
    <ModalForm
      formRef={formRef}
      title="批量报名"
      visible={visible}
      trigger={(type === 1 && <Button type="link">批量报名</Button>) || undefined}
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
      <ProFormSelect
        placeholder="请选择学生"
        label="报名学生"
        rules={[{ required: true, message: '请选择学生报名' }]}
        name="XSJBSJIds"
        fieldProps={{ options: studentsData, mode: 'multiple' }}
      />
      <ProFormSelect
        placeholder="请选择辅导班"
        label="课后辅导"
        rules={[{ required: true, message: '请选择辅导课程' }]}
        name="KHFWSJIds"
        fieldProps={{ options: KCFDData, mode: 'multiple', disabled: true }}
      />
      <ProFormSelect
        placeholder="请选择课程班"
        label="课后课程"
        rules={[
          { required: true, message: '请选择课后课程' },
          { type: 'array', max: KXSL, message: `课后课程储量不能超过${KXSL}` },
        ]}
        name="KHBJSJIds"
        fieldProps={{ options: KHKCData, mode: 'multiple' }}
      />
    </ModalForm>
  );
};

export default forwardRef(SignUpClass);
