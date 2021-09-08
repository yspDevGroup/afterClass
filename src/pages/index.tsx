/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-09-08 19:37:44
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { getLoginPath } from '@/utils/utils';
import loadImg from '@/assets/loading.gif';

const Index = () => {
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    switch (initialState?.currentUser?.auth) {
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
        {
          const loginPath = getLoginPath();
          if (loginPath.startsWith('http')) {
            window.location.href = loginPath;
          } else {
            history.replace(loginPath);
          }
        }
        break;
    }
    // if (initialState?.currentUser?.adminAuth?.includes('系统管理')) {
    //   // 支持PC登录，默认为管理员
    //   history.replace('/homepage');
    // }
  }, [initialState?.currentUser?.adminAuth, initialState?.currentUser?.auth]);
  return (
    <div>
      <img
        style={{
          width: '50vw',
          maxWidth: '400px',
          margin: '0 auto',
          paddingTop: '15vh',
          display: 'block',
        }}
        src={loadImg}
      />
    </div>
  );
};

export default Index;
