/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:50:45
 * @LastEditTime: 2021-10-13 11:01:25
 * @LastEditors: zpl
 */

import { enHenceMsg, getCurrentStatus } from '@/utils/utils';
import { homePageInfo } from '../after-class/user';
import { queryXNXQList } from './xnxq';

export const ParentHomeData = async (xxId: string, JSId: string) => {
  let courseStatus = 'empty';
  const result = await queryXNXQList(xxId, undefined);
  if (result.current) {
    const res = await homePageInfo({
      JSId,
      XNXQId: result.current.id,
      XXJBSJId: xxId,
    });
    if (res?.status === 'ok') {
      courseStatus = 'empty';
      if (res.data) {
        const { bmkssj, bmjssj, skkssj, skjssj } = res.data;
        if (bmkssj && bmjssj && skkssj && skjssj) {
          const cStatus = getCurrentStatus(bmkssj, bmjssj, skkssj, skjssj);
          courseStatus = cStatus;
        }
      }
      return {
        courseStatus,
        ...res?.data,
      };
    }
    enHenceMsg(res.message);
    return {
      courseStatus,
    };

  }
  return {
    courseStatus,
  };

};
