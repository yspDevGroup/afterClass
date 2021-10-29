/*
 * @description: 认证失效界面，主要用于失效后不能跳转到登录页的情况，例如微信端
 * @author: zpl
 * @Date: 2021-07-14 17:40:53
 * @LastEditTime: 2021-10-29 14:40:48
 * @LastEditors: zpl
 */
import Nodata from '@/components/Nodata';
// import { removeWechatInfo } from '@/utils/wx';
import { removeOAuthToken } from '@/utils/utils';
import overImg from '@/assets/loading.png';

const OverDue = () => {
  // removeWechatInfo();
  removeOAuthToken();
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -70%)',
      }}
    >
      <Nodata imgSrc={overImg} desc="您还未登录或登录信息已过期，请关闭应用后重新进入" />
    </div>
  );
};

export default OverDue;
