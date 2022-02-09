/*
 * @description: 应用入口
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-12-24 16:53:14
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { envjudge, getLoginPath, getOauthToken, getPageQuery, gotoLink } from '@/utils/utils';
import loadImg from '@/assets/loading.gif';

const Index = () => {
  const { initialState } = useModel('@@initialState');

  const gotoLogin = (suiteID: string, isAdmin: string) => {
    const loginPath = getLoginPath(suiteID, isAdmin, initialState?.buildOptions);
    gotoLink(loginPath);
  };

  useEffect(() => {
    const ej = envjudge();
    // 判断应用id和用户类型
    const query = getPageQuery();
    const params: Record<string, string> = {
      ...query,
      plat: 'school',
    };
    params.suiteID = params.SuiteID || params.suiteID || '';

    if (initialState?.buildOptions.authType === 'wechat') {
      if (params.suiteID) {
        const { ysp_access_token } = getOauthToken();
        if (!ysp_access_token || !initialState?.currentUser) {
          gotoLogin(params.suiteID, params.isAdmin);
          return;
        }

        // 检查登录状态
        switch (initialState!.currentUser.type) {
          case '管理员': {
            if (ej === 'mobile' || ej === 'wx-mobile' || ej === 'com-wx-mobile') {
              history.replace('/information/home');
            } else {
              history.replace('/homepage');
            }
            break;
          }
          case '老师': {
            // if (ej === 'pc' || ej === 'wx-pc' || ej === 'com-wx-pc') {
            //   history.replace('/homepage');
            // } else {
            history.replace('/teacher/home');
            // }
            break;
          }
          // if (params.isAdmin === '1') {
          //   if (ej === 'mobile' || ej === 'wx-mobile' || ej === 'com-wx-mobile') {
          //     history.replace('/information/home');
          //   } else {
          //     history.replace('/homepage');
          //   }
          // } else {
          //   history.replace('/teacher/home');
          // }
          // break;
          case '家长':
            localStorage.removeItem('studentId');
            localStorage.removeItem('studentName');
            localStorage.removeItem('studentXQSJId');
            localStorage.removeItem('studentNjId');
            localStorage.removeItem('studentBJId');
            history.replace('/parent/home');
            break;
          case '其他':
            history.replace('/403?message=抱歉，您的企业暂未通过审核，请联系管理员');
            break;
          default:
            history.replace('/403?title=未获取到合法的用户身份');
            break;
        }
      } else {
        history.replace('/403?title=未指定应用ID');
      }
    } else {
      switch (initialState?.currentUser?.type) {
        case '系统管理员': {
          if (ej === 'mobile' || ej === 'wx-mobile' || ej === 'com-wx-mobile') {
            history.replace('/information/home');
          } else {
            history.replace('/homepage');
          }
          break;
        }
        case '老师': {
          // if (ej === 'pc' || ej === 'wx-pc' || ej === 'com-wx-pc') {
          //   history.replace('/homepage');
          // } else {
          history.replace('/teacher/home');
          // }
          break;
        }
        case '家长':
          history.replace('/parent/home');
          break;
        case '其他':
          history.replace('/403?message=抱歉，您的企业暂未通过审核，请联系管理员');
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
