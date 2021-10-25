import { useEffect } from 'react';
import { history } from 'umi';

const EducationalPage: React.FC = () => {
  useEffect(() => {
    window.open('http://moodle.xianyunshipei.com/course/view.php?id=12');
     history.go(-1);
  }, []);

  return <div />;
};
export default EducationalPage;
