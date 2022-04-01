import { useEffect } from 'react';
import { history, useModel } from 'umi';

const EducationalPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    if (!initialState) return;
    const { crpHost, clientId, ENV_host } = initialState.buildOptions;
    // window.open('http://moodle.xianyunshipei.com/course/view.php?id=12');
    const url_api = decodeURIComponent(new URL(`${ENV_host}/api`).href);
    const ysp_token_type = localStorage.getItem('ysp_token_type');
    const ysp_access_token = localStorage.getItem('ysp_access_token');
    const params = JSON.stringify({ plat: 'school' });
    const url = `${crpHost}/auth_callback/wechat?url_api=${url_api}&clientId=${clientId}&token_type=${ysp_token_type}&access_token=${ysp_access_token}&params=${params}`;
    window.open(url);
    history.go(-1);
  }, [initialState]);

  return <div />;
};
export default EducationalPage;
