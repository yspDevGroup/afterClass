import { message, Space } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, useModel } from 'umi';
import { postAccount } from '@/services/after-class/auth';
import logo from '@/assets/logo.png';
import styles from './index.less';
import { GithubOutlined, WechatOutlined } from '@ant-design/icons';

/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as {
      redirect: string;
    };
    console.log('query', query);

    history.push(redirect || '/homepage');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState(initialState ? { ...initialState, currentUser: userInfo } : undefined);
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);

    try {
      // 登录
      const msg = await postAccount({ ...values, type: type as 'account' | 'mobile' });
      if (msg.status === 'ok') {
        message.success('登录成功！');
        localStorage.setItem('token', msg.data.token || '');

        await fetchUserInfo();
        goto();

        return;
      }
      message.error(msg.message);
    } catch (error) {
      message.error('登录失败，请重试！');
    }

    setSubmitting(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.top}>
            <img src={logo} />
            <h3>
              {ENV_title}
              <br />
              {ENV_subTitle}
            </h3>
          </div>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as API.LoginParams);
            }}
          >
            <>
              <ProFormText
                name="username"
                placeholder="账号/手机号/邮箱"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入账号/手机号/邮箱!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                placeholder="密码"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
            <div
              style={{
                marginBottom: 32,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                下次自动登录
              </ProFormCheckbox>
            </div>
          </ProForm>
          <Space className={styles.other}>
            <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
            <a href={`${initialState?.buildOptions.ssoHost}/auth/wechat`}>
              <WechatOutlined className={styles.icon} />
            </a>
            <a href={`${initialState?.buildOptions.ssoHost}/auth/github`}>
              <GithubOutlined className={styles.icon} />
            </a>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Login;
