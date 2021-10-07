/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import ProFormFields from '@/components/ProFormFields';
import { createKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';
import type { ActionType } from '@ant-design/pro-table/lib/typing';
import { message, Table, Button, Drawer } from 'antd';
import type { classType } from '../data';
import styles from './index.less';
import { courseColorType } from '@/theme-default';
import { history } from 'umi';

type PropsType = {
  current?: classType;
  onClose?: () => void;
  readonly?: boolean;
  visible?: boolean;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  kclxOptions?: any[];
  setOpentype: (arg0: boolean) => void;
  optionsNJ?: any[];
  currentUser?: API.CurrentUser;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const NewCourses = (props: PropsType) => {
  const {
    current,
    onClose,
    visible,
    actionRef,
    readonly,
    kclxOptions,
    optionsNJ,
    currentUser,
  } = props;
  const [form, setForm] = useState<any>();
  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');
  const [isTrue, setIsTrue] = useState(true);

  const title = current ? '编辑课程' : '新增课程';
  const values = () => {
    if (current) {
      const { KHKCLX, KCZT, ...info } = current;
      return {
        KCZT: KCZT === '已取消' ? '待发布' : KCZT,
        KCLXId: KHKCLX?.id,
        ...info,
      };
    }
    return {
      KCZT: '待发布',
    };
  };
  const Close = () => {
    setImageUrl('');
    onClose?.();
  };
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
          form.setFieldsValue({ KCTP: res.data });
          setImageUrl(res.data);
          setIsTrue(false);
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
      const optionse = {
        ...values,
        KCTP: imageUrl,
        XXJBSJId: currentUser?.xxId,
        SSJGLX: '校内课程',
      };
      if (current?.id) {
        const params = {
          id: current?.id,
        };
        res = updateKHKCSJ(params, optionse);
      } else {
        res = createKHKCSJ({
          ...optionse,
          KCZT: 0,
        });
      }
      resolve(res);
      reject(res);
    })
      .then((data: any) => {
        if (data.status === 'ok') {
          message.success('保存成功');
          Close?.();
          actionRef?.current?.reload();
        } else if (data.message === 'Validation error') {
          message.error(`保存失败，课程名称重复`);
        } else {
          message.error(`保存失败，${data.message}，请联系管理员`);
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
      rules: [
        { required: true, message: '请填写名称' },
        { max: 18, message: '最长为 18 位' },
      ],
      disabled: readonly,
      fieldProps: {
        autocomplete: 'off',
      },
    },
    {
      type: 'select',
      label: '课程类型',
      name: 'KHKCLXId',
      key: 'KHKCLXId',
      rules: [{ required: true, message: '请填选择课程类型' }],
      disabled: readonly,
      options: kclxOptions,
    },
    {
      type: 'select',
      label: '适用年级',
      name: 'njIds',
      key: 'njIds',
      rules: [{ required: true, message: '请填选择适用年级' }],
      disabled: readonly,
      options: optionsNJ,
      mode: 'multiple',
    },
    {
      type: 'select',
      label: '课程颜色',
      name: 'KBYS',
      key: 'KBYS',
      disabled: readonly,
      options: [
        { label: '绯红', value: courseColorType.crimson },
        { label: '橙色', value: courseColorType.orange },
        { label: '黄色', value: courseColorType.yellow },
        { label: '蓝色', value: courseColorType.blue },
        { label: '天空蓝', value: courseColorType.skyBlue },
        { label: '紫色', value: courseColorType.violet },
        { label: '紫红色', value: courseColorType.purplishRed },
      ],
      rules: [{ required: true, message: '请填选择课程颜色' }],
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
      rules: [{ required: isTrue, message: '请上传封面图片' }],
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
        maskClosable={readonly}
        footer={
          readonly ? (
            ''
          ) : (
            <div
              style={{
                textAlign: 'right',
              }}
            >
               <Button onClick={handleSubmit} type="primary" style={{ marginRight: 16 }}>
                保存
              </Button>
              <Button onClick={Close} >
                取消
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
