/*
 * @description: 微信相关路由
 * @author: zpl
 * @Date: 2021-06-10 16:40:10
 * @LastEditTime: 2021-06-10 17:19:46
 * @LastEditors: zpl
 */
import { getDepList } from '@/services/after-class/wechat';

/**
 * 获取校区列表，使用缓存
 *
 * @param {true} [refresh] 是否强制刷新
 * @return {*}
 */
export const queryXQList = async (refresh?: true) => {
  if (!wx_XQList || refresh) {
    const res = await getDepList({});
    if (res.status === 'ok') {
      const depList = res.data.departments as WXDepType[];
      wx_XQList = depList.filter((dep: WXDepType) => dep.type === 4);
      for (let i = 0; i < wx_XQList.length; i += 1) {
        const xq = wx_XQList[i];
        xq.njList = depList.filter((dep) => dep.parentid === xq.id);
      }
    }
  }
  return wx_XQList;
};
