/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-07-05 11:49:14
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';

const Index = () => {
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
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
        break;
    }
  }, [initialState?.currentUser?.auth]);
  return <div>loading...</div>;
};

export default Index;
