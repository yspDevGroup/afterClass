/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-09-09 09:29:18
 * @LastEditors: zpl
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
    <div>
      <img
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
        }}
        src={loadImg}
      />
    </div>
  );
};

export default Index;
