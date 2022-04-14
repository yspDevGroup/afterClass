/*
 * @description: 应用入口
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2022-04-14 10:57:50
 * @LastEditors: Wu Zhan
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { getOauthToken, gotoLogin, gotoAdmin, gotoTeacher, gotoParent } from '@/utils/utils';
import loadImg from '@/assets/loading.gif';

const Index = () => {
  const { initialState } = useModel('@@initialState');

  /**
   * 根据不同身份进入对应的应用主页
   *
   * @param {(string | string[])} userType 用户身份
   */
  const gotoIndex = (userType: string | string[]) => {
    const isAdmin = Array.isArray(userType)
      ? userType.find((u) => ['系统管理员', '管理员'].includes(u))
      : ['系统管理员', '管理员'].includes(userType);
    if (isAdmin) {
      gotoAdmin();
      return;
    }
    const isTeacher = Array.isArray(userType) ? userType.includes('老师') : userType === '老师';
    if (isTeacher) {
      gotoTeacher();
      return;
    }
    const isParent = Array.isArray(userType) ? userType.includes('家长') : userType === '家长';
    if (isParent) {
      gotoParent();
      return;
    }
    const isOther = Array.isArray(userType) ? userType.includes('其他') : userType === '其他';
    if (isOther) {
      history.replace('/403?message=抱歉，您的企业暂未通过审核，请联系管理员');
      return;
    }
    history.replace('/403?title=未获取到合法的用户身份');
  };

  useEffect(() => {
    // 是否有登录
    const { ysp_access_token } = getOauthToken();
    const hasLoginInfo: boolean = ysp_access_token && initialState?.currentUser;
    if (hasLoginInfo) {
      gotoIndex(initialState?.currentUser?.type);
    } else {
      gotoLogin(initialState?.buildOptions);
    }
  }, [initialState?.currentUser?.type]);
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.2)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <img
        src={loadImg}
        alt="loading"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          backgroundColor: '#fff',
          borderRadius: '200px',
          padding: '14px',
        }}
      />
    </div>
  );
};

export default Index;
