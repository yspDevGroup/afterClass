/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-09-09 13:42:41
 * @LastEditors: Sissle Lynn
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { getLoginPath } from '@/utils/utils';
import loadImg from '@/assets/loading.gif';

const Index = () => {
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
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
  }, [initialState?.currentUser?.adminAuth, initialState?.currentUser?.type]);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.2)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }}>
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
          padding: '14px'
        }}
      />
    </div>
  );
};

export default Index;
