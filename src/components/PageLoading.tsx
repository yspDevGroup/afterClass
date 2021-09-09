import type { FC } from 'react';
import loadImg from '@/assets/loading.gif';

const PageLoading: FC = () => {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.2)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }}>
      <img
        src={loadImg}
        alt="loading"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          backgroundColor: '#fff',
          borderRadius: '200px',
          padding: '14px'
        }}
      />
    </div>
  );
};

export default PageLoading;
