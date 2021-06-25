import { useLayoutEffect, useRef } from 'react';

const WWOpenDataCom = ({ type, openid }: { type: string; openid?: string }) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    WWOpenData.bind(ref.current);
  });
  return <ww-open-data ref={ref} type={type} openid={openid} style={{ color: '#333' }} />;
};

export default WWOpenDataCom;
