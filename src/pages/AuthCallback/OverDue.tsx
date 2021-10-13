import Nodata from '@/components/Nodata';
import { removeWechatInfo } from '@/utils/wx';
import { removeOAuthToken } from '@/utils/utils';
import overImg from '@/assets/loading.png';

const OverDue = () => {
  removeWechatInfo();
  removeOAuthToken();
  return (
    <div>
      <Nodata imgSrc={overImg} desc="您还未登录或登录信息已过期，请关闭应用后重新进入" />
    </div>
  );
};

export default OverDue;
