/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import ProFormFields from '@/components/ProFormFields';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { createKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import type { ActionType } from '@ant-design/pro-table/lib/typing';
import { message, notification } from 'antd';
import { Button, Drawer } from 'antd';
import moment from 'moment';
import type { classType } from '../data';
import styles from './index.less';

type PropsType = {
  current?: classType;
  onClose?: () => void;
  readonly?: boolean;
  visible?: boolean;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  xn?: string;
  xq?: string;
  xnxq?: any;
  setOpentype: (arg0: boolean) => void;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const NewCourses = (props: PropsType) => {
  const { current, xn, xq, xnxq, onClose, visible, actionRef, readonly, setOpentype } = props;
  const [options, setOptions] = useState<any[]>([]);
  const [form, setForm] = useState<any>();
  const [XNData, setXNData] = useState<any>([]);
  const [XQData, setXQData] = useState<any>([]);
  const [XN, setXN] = useState<any>();
  const [XQ, setXQ] = useState<any>();
  const [baoming, setBaoming] = useState<boolean>(false);
  const [kaike, setKaike] = useState<boolean>(false);
  // 上课时间
  const [classattend, setClassattend] = useState<any>('');
  // 报名时间
  const [signup, setSignup] = useState<any>('');
  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');

  const title = current ? '编辑课程' : '新增课程';
  const values = () => {
    if (current) {
      const { KHKCLX, KCZT, ...info } = current;
      return {
        KCZT: KCZT === '已下架' ? '待发布' : KCZT,
        KCLXId: KHKCLX?.id,
        ...info,
      };
    }
    return {
      XN: xn,
      XQ: xq,
      KCZT: '待发布',
    };
  };
  const Close = () => {
    setBaoming(false);
    setKaike(false);
    setImageUrl('');
    onClose!();
  };
  const onXnXqChange = async (xnValue: any, xqvalue: any) => {
    const params = {
      xn: xnValue,
      xq: xqvalue,
      type: ['1', '2'],
    };
    const res = await getAllXXSJPZ(params);
    if (res.status === 'ok') {
      const arry: any[] = [];
      const erry: any[] = [];
      res.data?.map((item: any) => {
        if (item.TYPE === '1') {
          arry.push(item.KSSJ, item.JSSJ);
        }
        if (item.TYPE === '2') {
          erry.push(item.KSSJ, item.JSSJ);
        }
        return true;
      });
      setSignup(arry);
      setClassattend(erry);
      if (arry.length === 0 || erry.length === 0) {
        notification.warning({
          message: '缺少系统配置时间',
          description: '当前没有该学期的系统配置时间，请先前往时段维护配置系统时间.',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      }
    }
  };
  useEffect(() => {
    if (visible) {
      if (xnxq) {
        setXNData(xnxq.data);
        setXQData(xnxq.subData);
      }
      if (current) {
        onXnXqChange(current.XNXQ?.XN, current.XNXQ?.XQ);
      } else {
        onXnXqChange(xn, xq);
      }
      const res = getAllKHKCLX({ name: '' });
      Promise.resolve(res).then((data) => {
        if (data.status === 'ok') {
          const opt: any[] = [];
          data.data?.map((item: any) => {
            return opt.push({
              label: item.KCLX,
              value: item.id,
            });
          });
          if (opt === []) {
            setOpentype(true);
          }
          setOptions(opt);
        }
      });
    }
  }, [visible, xnxq, xn, xq, current]);
  useEffect(() => {
    if (current) {
      if (signup) {
        const date = current.BMKSSJ && current.BMKSSJ[0]?.substring(0, 10);
        const date1 = current.BMKSSJ && current.BMKSSJ[1]?.substring(0, 10);
        if (!(date === signup[0] && date1 === signup[1])) {
          setBaoming(true);
        }
      }
      if (classattend) {
        const date = current.KKRQ && current.KKRQ[0]?.substring(0, 10);
        const date1 = current.KKRQ && current.KKRQ[1]?.substring(0, 10);

        if (!(date === classattend[0] && date1 === classattend[1])) {
          setKaike(true);
        }
      }
    }
  }, [current, signup, classattend]);

  const handleSubmit = () => {
    form.submit();
  };
  const handleImageChange = (e: any) => {
    if (e.file.status === 'done') {
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        const res = e.file.response;
        if (res.status === 'ok') {
          message.success(`上传成功`);
          setImageUrl(res.data);
        }
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;
      message.error(`上传失败，${mass}`);
    }
  };

  const onFinish = (values: any) => {
    new Promise((resolve, reject) => {
      let res = null;
      if (current?.id) {
        const params = {
          id: current?.id,
        };
        if (values.KKRQ) {
          values.JKRQ = values.KKRQ[1];
          values.KKRQ = values.KKRQ[0];
        }
        if (values.BMKSSJ) {
          values.BMJSSJ = moment(values.BMKSSJ[1]);
          values.BMKSSJ = moment(values.BMKSSJ[0]);
        }
        const optionse = { ...values, KCTP: imageUrl };
        res = updateKHKCSJ(params, optionse);
      } else {
        if (!kaike) {
          values.KKRQ = classattend[0];
          values.JKRQ = classattend[1];
        } else {
          values.JKRQ = values.KKRQ[1];
          values.KKRQ = values.KKRQ[0];
        }
        if (!baoming) {
          values.BMKSSJ = new Date(moment(new Date(signup[0])).format('YYYY-MM-DD HH:mm:ss'));
          values.BMJSSJ = new Date(moment(new Date(signup[1])).format('YYYY-MM-DD HH:mm:ss'));
        } else {
          values.BMJSSJ = new Date(
            moment(new Date(values.BMKSSJ[1])).format('YYYY-MM-DD HH:mm:ss'),
          );
          values.BMKSSJ = new Date(
            moment(new Date(values.BMKSSJ[0])).format('YYYY-MM-DD HH:mm:ss'),
          );
        }
        res = createKHKCSJ({ ...values, KCTP: imageUrl, KCZT: '待发布' });
      }
      resolve(res);
      reject(res);
    })
      .then((data: any) => {
        if (data.status === 'ok') {
          message.success('保存成功');
          onClose!();
          actionRef?.current?.reload();
        } else if (data.message === 'Validation error') {
          message.error(`保存失败，课程名称重复`);
        } else {
          message.error(`保存失败，${data.message},请联系管理员`);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const formItems: any[] = [
    {
      type: 'input',
      hidden: true,
      name: 'id',
      key: 'id',
      fieldProps: {
        autoComplete: 'off',
      },
    },
    {
      type: 'input',
      label: '名称:',
      name: 'KCMC',
      key: 'KCMC',
      width: '100%',
      rules: [{ required: true, message: '请填写名称' }],
      disabled: readonly,
      fieldProps: {
        autocomplete: 'off',
        maxLength: 23,
      },
    },
    {
      type: 'select',
      label: '课程类型:',
      name: 'KHKCLXId',
      key: 'KHKCLXId',
      rules: [{ required: true, message: '请填选择类型' }],
      disabled: readonly,
      options,
    },
    {
      type: 'select',
      label: '课程状态:',
      name: 'KCZT',
      key: 'KCZT',
      valueEnum: {
        待发布: '待发布',
      },
      fieldProps: {
        disabled: true,
        initialValues: '待发布',
      },
    },
    {
      type: 'cascader',
      label: '学年学期：',
      key: 'XNXQ',
      disabled: readonly,
      rules: [{ required: true, message: '请填写学年学期' }],
      cascaderItem: [
        {
          type: 'select',
          width: '100%',
          name: 'XN',
          key: 'XN',
          placeholder: '请选择学年',
          noStyle: true,
          disabled: readonly,
          options: XNData,
          rules: [{ required: true, message: '请填写学年' }],
          fieldProps: {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              setXN(event);
              setXQ(XQData[`${event}`]);
              onXnXqChange(event, XQData[`${event}`][0].label);
            },
          },
        },
        {
          type: 'select',
          name: 'XQ',
          width: '100%',
          key: 'XQ',
          disabled: readonly,
          placeholder: '请选择学期',
          noStyle: true,
          options: XQ,
          rules: [{ required: true, message: '请填写学期' }],
          fieldProps: {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              onXnXqChange(XN, event);
            },
          },
        },
      ],
    },
    signup.length > 0
      ? {
          type: 'divTab',
          text: `(默认报名时间段)：${moment(signup[0]).format('YYYY-MM-DD')} — ${moment(
            signup[1],
          ).format('YYYY-MM-DD')}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'div',
      key: 'div',
      label: '单独设置报名时段：',
      disabled: readonly,
      lineItem: [
        {
          type: 'switch',
          disabled: readonly,
          fieldProps: {
            onChange: (item: any) => {
              if (item === false) {
                return setBaoming(false);
              }
              return setBaoming(true);
            },
            checked: baoming,
          },
        },
      ],
    },
    {
      type: 'dateRange',
      label: '报名时间:',
      name: 'BMKSSJ',
      key: 'BMKSSJ',
      width: '100%',
      disabled: readonly,
      hidden: !baoming,
      fieldProps: {
        disabledDate: (currente: any) => {
          const defaults = moment(currente).format('YYYY-MM-DD HH:mm:ss');
          return defaults > signup[1] || defaults < signup[0];
        },
      },
    },
    classattend.length > 0
      ? {
          type: 'divTab',
          text: `(默认上课时间段)：${classattend[0]} — ${classattend[1]}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'div',
      key: 'div1',
      label: '单独设置上课时段：',
      disabled: readonly,
      lineItem: [
        {
          type: 'switch',
          disabled: readonly,
          fieldProps: {
            onChange: (item: any) => {
              if (item === false) {
                return setKaike(false);
              }
              return setKaike(true);
            },
            checked: kaike,
          },
        },
      ],
    },
    {
      type: 'dateRange',
      label: '上课时间:',
      name: 'KKRQ',
      key: 'KKRQ',
      width: '100%',
      disabled: readonly,
      hidden: !kaike,
      fieldProps: {
        disabledDate: (currente: any) => {
          const defaults = moment(currente).format('YYYY-MM-DD HH:mm:ss');
          return defaults > classattend[1] || defaults < classattend[0];
        },
      },
    },
    {
      type: 'uploadImage',
      label: '封面：',
      name: 'KCTP',
      key: 'KCTP',
      disabled: readonly,
      imagename: 'image', // 发到后台的文件参数名
      upurl: '/api/upload/uploadFile', // 上传地址
      imageurl: imageUrl || current?.KCTP, // 回显地址
      handleImageChange,
      accept: '.jpg, .jpeg, .png', // 接受上传的文件类型
    },
    {
      type: 'textArea',
      label: '简 介:',
      name: 'KCMS',
      disabled: readonly,
      key: 'KCMS',
    },
  ];

  return (
    <>
      <Drawer
        title={readonly ? '查看信息' : title}
        width={480}
        onClose={Close}
        visible={visible}
        className={styles.courseStyles}
        destroyOnClose={true}
        bodyStyle={{ paddingBottom: 80 }}
        maskClosable={false}
        footer={
          readonly ? (
            ''
          ) : (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={Close} style={{ marginRight: 16 }}>
                取消
              </Button>
              <Button onClick={handleSubmit} type="primary">
                保存
              </Button>
            </div>
          )
        }
      >
        <ProFormFields
          layout="vertical"
          setForm={setForm}
          onFinish={onFinish}
          values={values()}
          formItems={formItems}
          formItemLayout={formLayout}
        />
      </Drawer>
    </>
  );
};

export default NewCourses;
