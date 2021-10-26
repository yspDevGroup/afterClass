/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:50:45
 * @LastEditTime: 2021-10-26 16:45:06
 * @LastEditors: Sissle Lynn
 */

import { enHenceMsg, getCurrentStatus } from '@/utils/utils';
import { homePageInfo } from '../after-class/user';
import { queryXNXQList } from './xnxq';

const getHomeData = async (xxId: string, userId: string, type: string) => {
  let courseStatus = 'empty';
  const result = await queryXNXQList(xxId);
  if (result.current) {
    const params: any = {
      XNXQId: result.current.id,
      XXJBSJId: xxId,
    };
    type === 'teacher' ? params.JSId = userId : params.XSId = userId;
    const res = await homePageInfo(params);
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
}

export const ParentHomeData = async (xxId: string, userId: string, type: string, refresh?: boolean) => {
  if (typeof teacherHomeInfo === 'undefined') {
    ((w) => {
      // eslint-disable-next-line no-param-reassign
      w.teacherHomeInfo = {};
    })(window as Window & typeof globalThis & { teacherHomeInfo: any });
  }
  if (!teacherHomeInfo.data || refresh) {
    const res = await getHomeData(xxId, userId, type);
    teacherHomeInfo.data = res;
    return res;
  }
  return teacherHomeInfo.data;
};
