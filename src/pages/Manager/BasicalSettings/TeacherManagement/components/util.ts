/*
* @description:
* @author: Sissle Lynn
* @Date: 2021-11-01 08:58:42
* @LastEditTime: 2021-11-01 10:59:43
* @LastEditors: Sissle Lynn
*/
import { getHash } from "@/services/after-class/redis";

export const getHashData  = async (type: string) => {
  const res = await getHash({
    key:type,
    fields: [
      'string'
    ],
    isAll: true
  });
  if (res.status === 'ok' && res.data) {
    const { data } = res;
    const list = [];
    if (data) {
      for (let item of data) {
        list.push({
          text: item.dmhy,
          value: item.dmhy
        })
      }
    }
    return list;
  } else {
    return [];
  };
};
