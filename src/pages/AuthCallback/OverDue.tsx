import Nodata from '@/components/Nodata';
import overImg from '@/assets/loading.png';

const OverDue = () => {
  return (
    <div>
      <Nodata imgSrc={overImg} desc='认证超时，请关闭应用后重新进入' />
    </div>
  );
};

export default OverDue;
