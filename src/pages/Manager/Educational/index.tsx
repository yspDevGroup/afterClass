import { getCrpUrl } from '@/utils/utils';
import { useEffect } from 'react';
import { history, useAccess, useModel } from 'umi';

const EducationalPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { isSso, isWechat } = useAccess();
  useEffect(() => {
    if (!initialState) return;
    // window.open('http://moodle.xianyunshipei.com/course/view.php?id=12');
    let url;
    if (isWechat) {
      url = getCrpUrl(initialState.buildOptions, 'password', '1');
    }
    if (isSso) {
      url = getCrpUrl(initialState.buildOptions, 'password', '1');
    }
    if (url) {
      window.open(url);
      history.go(-1);
    }
  }, [initialState]);

  return <div />;
};
export default EducationalPage;
