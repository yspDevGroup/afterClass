/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-06-10 09:39:44
 * @LastEditors: zpl
 */
import { useModel, history } from 'umi';
// import { envjudge } from '@/utils/utils';

// let loginPath: string;
// switch (envjudge()) {
//   case 'com-wx-mobile': // 手机端企业微信
//   case 'wx-mobile': // 手机端微信
//   case 'com-wx-pc': // PC端企业微信
//   case 'wx-pc': // PC端微信
//     loginPath = `${ENV_backUrl}/wechat/platAuth`;
//     break;
//   case 'mobile': // 手机
//   case 'pc': // PC
//   default:
//     loginPath = '/user/login'; // `${ENV_backUrl}/auth/wechat`;
//     break;
// }

const Index = () => {
  const { initialState } = useModel('@@initialState');

  switch (initialState?.currentUser?.auth) {
    case '管理员':
      history.replace('/courseManagements');
      break;
    case '老师':
      history.replace('/teacher/home');
      break;
    case '家长':
      history.replace('/parent/home');
      break;
    default:
      // TODO: 后期需要修改为跳转向非法访问提示页面
      history.replace('/courseManagements');
      // history.replace(loginPath);
      break;
  }
  return <div></div>;
};

export default Index;
