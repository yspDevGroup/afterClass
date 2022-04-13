/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2022-04-12 15:36:27
 * @LastEditTime: 2022-04-13 16:03:36
 * @LastEditors: Wu Zhan
 */
import { Modal } from 'antd';

export const JSInforMation = (
  currentUser: API.CurrentUser | null | undefined,
  isModal: boolean = true,
) => {
  if (!currentUser?.JSId) {
    if (isModal) {
      Modal.info({
        title: '您暂未绑定教师账号， 请前往认证平台或联系管理员绑定。',
        width: '450px',
        okText: '去设置',
        maskClosable: true,
        onOk: () => {
          window.open('http://platform.test.xianyunshipei.com/oauth2/Password');
        },
      });
    }
    return false;
  } else {
    return true;
  }
};
