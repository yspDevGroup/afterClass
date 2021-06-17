/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-17 09:18:53
 * @LastEditTime: 2021-06-17 09:59:50
 * @LastEditors: txx
 */
import { dynamic } from 'umi';

export default dynamic({
  async loader() {
    const { default: AddRoom } = await import('./SignUpTable');
    return AddRoom;
  },
});