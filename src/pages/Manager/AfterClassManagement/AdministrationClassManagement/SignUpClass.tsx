/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-20 16:58:57
 * @LastEditTime: 2022-02-09 15:17:34
 * @LastEditors: zpl
 */
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button, message, Spin, Form } from 'antd';

import { getClassStudents } from '@/services/after-class/bjsj';
import { getKHFWBJ, studentRegistration } from '@/services/after-class/khfwbj';
import { getStudentListByBjid } from '@/services/after-class/khfwbj';
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
  XH?: string;
  XM?: string;
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
  const [FWFY, setFWFY] = useState<string>();

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    onSetVisible: (value: boolean) => {
      setVisible(value);
    },
  }));

  // 判断当前时间 是否在 范围内
  const getFlagTime = (KSQR: any, JSQR: any) => {
    if (KSQR && JSQR) {
      const nowTime = moment().valueOf();
      // const beginTime = moment(KSQR, 'YYYY-MM-DD').valueOf();
      const endTime = moment(JSQR, 'YYYY-MM-DD').add(1, 'days').valueOf();
      if (nowTime <= endTime) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const formRef = useRef<ProFormInstance<any>>();
  const { type, XNXQId, BJSJId, actionRef, XSJBSJId, title, setXSId, XH, XM } = props;

  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  const getXH = (_XH: string) => {
    if (_XH !== null && _XH.length > 4) {
      return `~${_XH.substring(_XH.length - 4)}`;
    } else {
      return `~ ${_XH}`;
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
    setLoading(true);
    const res = await getKHFWBJ({
      BJSJId,
      XNXQId,
    });
    if (res.status === 'ok') {
      const KCFD: any = [];
      const KHKC: any = [];
      let newKHFWSJPZIdData: any = [];
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
          if (getFlagTime(item.KSRQ, item.JSRQ)) {
            newKHFWSJPZIdData.push({
              label: (
                <>
                  <span style={{ fontSize: '16px' }}>{item.SDBM}</span>
                  <span style={{ color: '#999' }}>{` ${moment(item.KSRQ).format('MM-DD')}~${moment(
                    item.KSRQ,
                  ).format('MM-DD')}`}</span>
                </>
              ),
              value: item.id,
            });
          }
        });

        if (XSJBSJId && type === 2 && title !== '代选课') {
          const result = await getStudentListByBjid({
            XSJBSJId,
            ZT: [0, 1, 3],
            BJSJId,
            page: 0,
            pageSize: 0,
          });
          if (result.status === 'ok' && result?.data?.rows?.length) {
            // 只可退结束日期大于当前时间的课程
            const arr = result.data.rows?.[0]?.XSFWBJs.map((item: any) => item?.KHFWSJPZ?.id);
            newKHFWSJPZIdData = newKHFWSJPZIdData?.filter((item: any) => {
              if (arr?.length) {
                return !arr.includes(item.value);
              }
              return true;
            });
          }
        }

        if (newKHFWSJPZIdData.length) {
          formRef?.current?.setFieldsValue({
            KHFWSJPZIds: newKHFWSJPZIdData.map((item: SelectType) => item.value),
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
        // 获取服务费用，
        if (data?.FWFY) {
          setFWFY(data.FWFY);
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
      if (FWFY === '0.00') {
        params.ZT = 0;
      }
      // 班级详情下 学生批量报名存在时段
      // if (type !== 0 && KHFWSJPZId) {
      //   params.KHFWSJPZId = KHFWSJPZId;
      // }
      if (type === 2) {
        params.XSJBSJIds = [XSJBSJId];
      }
      const res = await studentRegistration(params);
      if (res.status === 'ok') {
        if (title === '代选课' && type === 2) {
          message.success('选课成功');
        } else {
          message.success('报名成功');
        }
        actionRef?.current?.reloadAndRest();
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
            submitText: title === '代选课' ? '选课' : '报名',
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
        {type === 2 && XM && XH && <Form.Item label="姓名学号：">{`${XM}——${XH}`}</Form.Item>}
        {
          // 保存并批量报名需要选择时段
          <ProFormSelect
            placeholder="选择报名时段"
            label="报名时段"
            rules={[{ required: true, message: '选择报名时段' }]}
            name="KHFWSJPZIds"
            fieldProps={{
              options: KHFWSJPZIdData,
              mode: 'multiple',
            }}
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
              { type: 'array', max: KXSL, message: `课后课程数量不能超过${KXSL}` },
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
