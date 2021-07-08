/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-07 16:02:16
 * @LastEditTime: 2021-07-05 11:49:14
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import loadImg from '@/assets/loading.gif';

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
  return <div><img style={{width:'50vw',maxWidth:'400px',margin:'0 auto',paddingTop:'15vh',display:'block'}} src={loadImg} /></div>;
};

export default Index;
