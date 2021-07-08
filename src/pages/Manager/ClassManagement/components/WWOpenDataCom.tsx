import { useLayoutEffect, useRef } from 'react';

const WWOpenDataCom = ({
  type,
  openid,
  style,
}: {
  type: string;
  openid?: string;
  style?: Record<any, any>;
}) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    WWOpenData.bind(ref.current);
  });
  return (
    <ww-open-data
      ref={ref}
      type={type}
      openid={openid}
      style={{ color: style.color || '#333', with: '100%', height: '22px' }}
    />
  );
};

export default WWOpenDataCom;
