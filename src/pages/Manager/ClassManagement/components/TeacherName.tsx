import React, { useEffect, useRef } from 'react';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';

const TeacherName = (props: { userId: string }) => {
  const { userId } = props;
  const userRef = useRef(null);
  useEffect(() => {
    const fetch = async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef.current, userId);
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
      }
    };
    fetch();
  }, []);
  return <span ref="userRef"></span>;
};
export default TeacherName;
