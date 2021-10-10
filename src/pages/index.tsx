/*
 * @description: 应用入口
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-10-10 17:43:37
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { getLoginPath, getPageQuery } from '@/utils/utils';
import loadImg from '@/assets/loading.gif';
import { getWechatInfo, needGetWechatUserInfo } from '@/utils/wx';

const Index = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const gotoLogin = (suiteID: string, isAdmin: string) => {
    const loginPath = getLoginPath(suiteID, isAdmin);
    if (loginPath.startsWith('http')) {
      window.location.href = loginPath;
    } else {
      history.replace(loginPath);
    }
  };

  useEffect(() => {
    // 判断应用id和用户类型
    const query = getPageQuery();
    const params: Record<string, string> = {
      ...query,
      plat: 'school',
    };
    params.suiteID = params.SuiteID || params.suiteID || '';

    if (authType === 'wechat') {
      if (params.suiteID) {
        if (needGetWechatUserInfo(params.suiteID)) {
          const loginPath = getLoginPath(params.suiteID, params.isAdmin);
          if (loginPath.startsWith('http')) {
            window.location.href = loginPath;
          } else {
            history.replace(loginPath);
          }
          return;
        }

        if (!initialState?.currentUser) {
          const currentInfo = getWechatInfo();
          // 反向填入当前用户信息，不发送登录请求，后续其他请求可使用之前的token正常发送
          setInitialState(currentInfo.userInfo);
        }

        // 检查登录状态
        switch (initialState?.currentUser?.type) {
          case '管理员':
            history.replace('/homepage');
            break;
          case '老师':
            if (params.isAdmin === '1') {
              history.replace('/homepage');
            } else {
              history.replace('/teacher/home');
            }
            break;
          case '家长':
            history.replace('/parent/home');
            break;
          default:
            gotoLogin(params.suiteID, params.isAdmin);
            break;
        }
      } else {
        history.replace('/403?message=未指定应用ID');
      }
    } else {
      switch (initialState?.currentUser?.type) {
        case '管理员':
          history.replace('/homepage');
          break;
        case '老师':
          history.replace('/teacher/home');
          break;
        case '家长':
          history.replace('/parent/home');
          break;
        default:
          gotoLogin('', '');
          break;
      }
    }
  }, [initialState?.currentUser?.adminAuth, initialState?.currentUser?.type]);
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
