/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-06-11 08:34:29
 * @LastEditors: zpl
 */
import { useModel, history } from 'umi';

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
