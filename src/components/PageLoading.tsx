import type { FC } from 'react';
import loadImg from '@/assets/loading.gif';

const PageLoading: FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.2)' }}>
      <img
        src={loadImg}
        alt="loading"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
        }}
      />
    </div>
  );
};

export default PageLoading;
