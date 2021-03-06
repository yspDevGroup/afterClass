/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React, { useRef, useState } from 'react';
import ProFormFields from '@/components/ProFormFields';
import { createKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';
import type { ActionType } from '@ant-design/pro-table/lib/typing';
import { message, Button, Drawer } from 'antd';
import type { classType } from '../data';
import styles from './index.less';
import { courseColorsType } from '@/theme-default';

type PropsType = {
  current?: classType;
  onClose?: () => void;
  readonly?: boolean;
  visible?: boolean;
  kclxOptions?: any[];
  optionsNJ?: any[];
  currentUser?: CurrentUser;
  getData: () => Promise<void>;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const NewCourses = (props: PropsType) => {
  const { current, onClose, visible, readonly, kclxOptions, optionsNJ, currentUser, getData } =
    props;
  const [form, setForm] = useState<any>();
  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');
  const [isTrue, setIsTrue] = useState(true);
  const actionRef = useRef<ActionType>();

  // eslint-disable-next-line no-nested-ternary
  const title = current ? (current?.type === 'copy' ? '复制课程' : '编辑课程') : '新增课程';
  const values = () => {
    if (current) {
      const { KHKCLX, KCZT, KCMC, type, ...info } = current;
      return {
        ...info,
        KCMC: type === 'copy' ? `${KCMC}-复制` : KCMC,
        KCZT: KCZT === '已取消' ? '待发布' : KCZT,
        KCLXId: KHKCLX?.id,
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
        KCTP: current && imageUrl === '' ? current?.KCTP : imageUrl,
        XXJBSJId: currentUser?.xxId,
        SSJGLX: '校内课程',
        KBYS: courseColorsType[Math.floor(Math.random() * 7)],
      };
      if (current?.id && current?.type === 'add') {
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
          getData();
          actionRef?.current?.reload();
        } else if (data.message === 'Validation error') {
          message.error(`保存失败，课程名称重复`);
        } else {
          message.error(`保存失败，${data.message || '请联系管理员'}`);
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
      label: '课程名称：',
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
      label: '课程类型：',
      name: 'KHKCLXId',
      key: 'KHKCLXId',
      rules: [{ required: true, message: '请填选择课程类型' }],
      disabled: readonly,
      options: kclxOptions,
    },
    {
      type: 'select',
      label: '适用年级：',
      name: 'njIds',
      key: 'njIds',
      rules: [{ required: true, message: '请填选择适用年级' }],
      disabled: readonly,
      options: optionsNJ,
      mode: 'multiple',
    },
    // {
    //   type: 'select',
    //   label: '课程颜色：',
    //   name: 'KBYS',
    //   key: 'KBYS',
    //   disabled: readonly,
    //   options: [
    //     { label: '深蓝色', value: courseColorType.DarkBlue },
    //     { label: '草绿色', value: courseColorType.GrassGreen },
    //     { label: '蓝绿色', value: courseColorType.BlueGreen },
    //     { label: '天蓝色', value: courseColorType.SkyBlue },
    //     { label: '深红色', value: courseColorType.Crimson },
    //     { label: '深紫色', value: courseColorType.DeepPurple },
    //     { label: '土黄色', value: courseColorType.EarthyYellow },
    //   ],
    //   rules: [{ required: true, message: '请填选择课程颜色' }],
    // },
    {
      type: 'uploadImage',
      label: '课程封面：',
      name: 'KCTP',
      key: 'KCTP',
      disabled: readonly,
      imagename: 'image', // 发到后台的文件参数名
      upurl: '/api/upload/uploadFile', // 上传地址
      imageurl: imageUrl || current?.KCTP, // 回显地址
      handleImageChange,
      accept: '.jpg, .jpeg, .png', // 接受上传的文件类型
      // rules: [{ required: isTrue, message: '请上传封面图片' }],
    },
    {
      type: 'textArea',
      label: '课程简介：',
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
              <Button onClick={Close}>取消</Button>
            </div>
          )
        }
      >
        <ProFormFields
          layout="vertical"
          actionRef={actionRef}
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
