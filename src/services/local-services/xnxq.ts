import { convertData } from "@/components/Search/util";
import { getCurrentXQ } from "@/utils/utils";
import { getAllXNXQ } from "../after-class/xnxq";

/**
 * 获取学年学期列表，使用缓存
 *
 * @param {true} [refresh] 是否强制刷新
 * @return {*}
 */
 export const queryXNXQList = async (
  refresh?: true,
): Promise<any> => {
  if (typeof xnxqInfo === 'undefined') {
    ((w) => {
      // eslint-disable-next-line no-param-reassign
      w.xnxqInfo = {};
    })(window as Window & typeof globalThis & { xnxqInfo: any });
  }
  if (!xnxqInfo.xnxqList || refresh) {
    const res = await getAllXNXQ({});
    if (res.status === 'ok') {
      const { data = [] } = res;
      const currentXQ = getCurrentXQ(data);
      xnxqInfo.xnxqList= convertData(data);
      xnxqInfo.current = currentXQ;
    }
  }
  return xnxqInfo;
};
