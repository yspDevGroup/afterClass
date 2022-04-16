import { getCrpUrl } from '@/utils/utils';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const EducationalPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    if (!initialState) return;
    // window.open('http://moodle.xianyunshipei.com/course/view.php?id=12');
    const url = getCrpUrl(initialState.buildOptions, '1');
    if (url) {
      window.open(url);
      history.go(-1);
    }
  }, [initialState]);

  return <div />;
};
export default EducationalPage;
