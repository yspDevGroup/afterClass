/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:50:45
 * @LastEditTime: 2021-09-15 11:58:14
 * @LastEditors: Sissle Lynn
 */

import { enHenceMsg, getCurrentStatus } from '@/utils/utils';
import { homePageInfo } from '../after-class/user';
import { queryXNXQList } from './xnxq';
export const ParentHomeData = async (xxId: string, xsId: string) => {
  let courseStatus = 'empty';
  const result = await queryXNXQList(xxId, undefined);
  if (result.current) {
    const res = await homePageInfo({
      XSId: xsId,
      XNXQId: result.current.id,
      XXJBSJId: xxId,
    });
    if (res?.status === 'ok') {
      let courseStatus = 'empty';
      if (res.data) {
        const { bmkssj, bmjssj, skkssj, skjssj } = res.data;
        if (bmkssj && bmjssj && skkssj && skjssj) {
          const cStatus = getCurrentStatus(bmkssj, bmjssj, skkssj, skjssj);
          courseStatus = cStatus;
        }
      }
      return {
        courseStatus,
        ...res?.data
      }
    } else {
      enHenceMsg(res.message);
      return {
        courseStatus
      }
    }
  } else {
    return {
      courseStatus
    }
  }
}
