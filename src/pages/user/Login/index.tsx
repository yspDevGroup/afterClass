import { Divider, message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, useModel } from 'umi';
import Footer from '@/components/Footer';
import { postAccount } from '@/services/after-class/auth';
import leftBg from '@/assets/leftBg.png';
import peopleBg from '@/assets/peopleBg.png';
import rightBg from '@/assets/rightBg.png';
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
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
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
      const msg = await postAccount({},{ ...values, type: type as 'account' | 'mobile' });
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
        <div className={styles.leftBg}>
          <img src={leftBg} />
        </div>
        <div className={styles.middleBg}>
          <img src={peopleBg} />
        </div>
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
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.teacherLogin.tab',
                  defaultMessage: '教师登录',
                })}
              />
              <Tabs.TabPane
                key="student"
                tab={intl.formatMessage({
                  id: 'pages.login.studentLogin.tab',
                  defaultMessage: '学生登录',
                })}
              />
            </Tabs>
            {type === 'account' && (
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
            )}
            {type === 'student' && (
              <>
                <ProFormText
                  name="username"
                  placeholder="学号"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.required"
                          defaultMessage="请输入学号！"
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
            )}
            <div
              style={{
                marginBottom: 32,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                下次自动登录
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                注册
              </a>
              <Divider
                type="vertical"
                style={{
                  float: 'right',
                }}
              />
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </div>
          </ProForm>
          <Space className={styles.other}>
            <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
            <a href={`${ENV_backUrl}/auth/wechat`}>
              <WechatOutlined className={styles.icon} />
            </a>
            <a href={`${ENV_backUrl}/auth/github`}>
              <GithubOutlined className={styles.icon} />
            </a>
          </Space>
        </div>
        <div className={styles.rightBg}>
          <img src={rightBg} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
