/* eslint-disable no-console */
import React, { useEffect, useRef } from 'react';
import { useModel } from 'umi';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import PageContainer from '@/components/PageContainer';

const PersonalHomepage = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const ref = useRef(null);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
      showUserName(ref?.current, currentUser?.userId);
      // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
      WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
    })();
  }, [currentUser]);

  return (
    <>
      <div ref={ref}></div>
      <PageContainer>考勤管理</PageContainer>
    </>
  );
};

export default PersonalHomepage;
