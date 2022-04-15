/*
 * @description: 登录页
 * @author: zpl
 * @Date: 2021-07-22 08:52:55

 * @LastEditTime: 2022-04-15 17:39:40
 * @LastEditors: Wu Zhan
 */
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';

import type { FormInstance } from 'antd/lib/form/hooks/useForm';

import logo from '@/assets/logo.png';
import styles from './index.less';
import { registerParent } from '@/services/after-class/auth';
import type { FormItemType } from '@/components/CustomForm/interfice';
import CustomForm from '@/components/CustomForm';

const formLayout: {
  labelCol: {
    span?: number | string;
    flex?: number | 'none' | 'auto' | string;
  };
  wrapperCol: {
    span?: number | string;
    flex?: number | 'none' | 'auto' | string;
  };
} = {
  labelCol: { flex: '5em' },
  wrapperCol: { flex: 'auto' },
};
const formItemList: FormItemType[] | any[] = [
  {
    key: 'username',
    type: 'input',
    name: 'XM',
    placeholder: '姓名',
    rules: [{ required: true, message: '请输入姓名' }],
    // prefix: <img src={username} />,
  },
  {
    key: 'LXDH',
    type: 'input',
    name: 'LXDH',
    placeholder: '联系电话',
    // prefix: <img src={password} />,
    rules: [{ required: true, message: '联系电话' }],
  },
  // {
  //   key: 'autoLogin',
  //   type: 'checkbox',
  //   desc: '记住密码'
  // }
];

/**
 * 组件入口
 *
 * @return {*}
 */
const ParentRegister = () => {
  const [form, setForm] = useState<FormInstance<any>>();

  const loginHandler = async () => {
    const values = await form?.validateFields();
    const res = await registerParent({ ...values });
    const { status } = res;
    if (status === 'ok') {
      message.success('注册成功');
    } else {
      message.warn(res.message);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.circular1} />
          <div className={styles.circular2} />
          <div className={styles.top}>
            <img src={logo} />
            <span>家长您好!</span>
            <span>欢迎注册课后服务平台</span>
          </div>
          <div className={styles.form}>
            <CustomForm
              setForm={setForm}
              formLayout={formLayout}
              formItems={formItemList}
              hideBtn={true}
            />
            <Button shape="round" block onClick={loginHandler} className={styles.but}>
              注册
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentRegister;
