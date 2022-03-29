/*
 * @description: 西安教育信息化综合服务平台登录
 * @author: zpl
 * @Date: 2022-03-15 15:30:49
 * @LastEditTime: 2022-03-29 20:12:21
 * @LastEditors: zpl
 */
import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { getPageQuery, removeOAuthToken, saveOAuthToken } from '@/utils/utils';
import { validateUrl } from '@/services/after-class/xaedu';
import { login as createToken } from '@/services/after-class/auth';
import RegistForm from './RegistForm';

const Index = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  const query = getPageQuery();
  const callbackUrl = encodeURIComponent(
    `${initialState?.buildOptions.ENV_host || ''}/auth_callback/xaedu`,
  );

  /**
   * 根据指定的身份进行登录并跳转
   *
   * @param {string} teacherId
   */
  const goto = async (teacherId: string, username: string) => {
    // const res = await createToken({ teacherId, username });
    const res = await createToken({
      authType: 'xaedu',
      plat: 'teacher',
      username,
      teacherId,
    });
    const { status, data, message } = res;
    if (status === 'ok') {
      saveOAuthToken({
        access_token: data!,
      });
      // 刷新全局属性后向首页跳转
      if (initialState) {
        const userInfo = await initialState.fetchUserInfo?.();
        setInitialState({ ...initialState, currentUser: { ...userInfo, type: '系统管理员' } });
        history.replace('/');
      } else {
        history.push(`/403?title=登录失败，请联系管理员&message=${message}`);
      }
    }
  };

  const login = async () => {
    const res = await validateUrl({
      ticket: query.ticket as string,
      service: callbackUrl,
    });
    const { status, data } = res;
    if (status === 'ok') {
      setCurrentUsername(data!.username!);
      if (data?.list?.length) {
        if (data.list.length === 1) {
          goto(data.list[0].id || '', data!.username!);
        } else {
          // TODO: 显示身份选择
        }
      } else {
        setIsModalVisible(true);
      }
    } else {
      setTimeout(() => {
        history.push(`/403?title=登录失败，请联系管理员&message=${res.message}`);
      }, 2000);
    }
  };

  useEffect(() => {
    localStorage.setItem('authType', 'xaedu');
    if (query.ticket) {
      login();
    } else {
      removeOAuthToken();
      window.location.href = `${initialState?.buildOptions.xaeduSsoHost}/sso/login?service=${callbackUrl}`;
    }
  }, []);

  return (
    <>
      <RegistForm show={isModalVisible} username={currentUsername} />
    </>
  );
};

export default Index;
