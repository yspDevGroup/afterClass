/*
 * @description: 应用入口
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2022-03-24 08:46:47
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { envjudge, getLoginPath, getOauthToken, getPageQuery, gotoLink } from '@/utils/utils';
import loadImg from '@/assets/loading.gif';

const ej = envjudge();

const Index = () => {
  const { initialState } = useModel('@@initialState');

  /**
   * 根据认证方式和url参数获取登录链接并跳转
   *
   */
  const gotoLogin = () => {
    const query = getPageQuery();
    const suiteID = (query.SuiteID || query.suiteID || '') as string;
    const isAdmin = query.isAdmin === 'true' ? query.isAdmin : undefined;
    const authType: AuthType = (localStorage.getItem('authType') as AuthType) || 'local';
    if (authType === 'wechat' && !suiteID) {
      history.replace('/403?title=未指定应用ID');
      return;
    }
    const loginPath = getLoginPath({
      suiteID,
      isAdmin,
      buildOptions: initialState?.buildOptions,
    });
    gotoLink(loginPath);
  };

  /**
   * 进入管理员界面
   *
   */
  const gotoAdmin = () => {
    if (ej.includes('mobile')) {
      gotoLink('/information/home');
    } else {
      gotoLink('/homepage');
    }
  };

  /**
   * 进入教师界面
   *
   */
  const gotoTeacher = () => {
    gotoLink('/teacher/home');
  };

  /**
   * 进入家长界面
   *
   */
  const gotoParent = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentXQSJId');
    localStorage.removeItem('studentNjId');
    localStorage.removeItem('studentBJId');
    gotoLink('/parent/home');
  };

  /**
   * 根据不同身份进入对应的应用主页
   *
   * @param {string} userType 用户身份
   */
  const gotoIndex = (userType: string) => {
    switch (userType) {
      case '系统管理员':
      case '管理员':
        gotoAdmin();
        break;
      case '老师':
        gotoTeacher();
        break;
      case '家长':
        gotoParent();
        break;
      case '其他':
        history.replace('/403?message=抱歉，您的企业暂未通过审核，请联系管理员');
        break;
      default:
        history.replace('/403?title=未获取到合法的用户身份');
        break;
    }
  };

  useEffect(() => {
    // 是否有登录
    const { ysp_access_token } = getOauthToken();
    const hasLoginInfo: boolean = ysp_access_token && initialState?.currentUser;
    if (hasLoginInfo) {
      gotoIndex(initialState?.currentUser.type);
    } else {
      gotoLogin();
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
