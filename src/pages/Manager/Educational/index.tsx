import { useEffect } from 'react';
import { history } from 'umi';

const EducationalPage: React.FC = () => {
  useEffect(() => {
    window.open('http://moodle.xianyunshipei.com/course/view.php?id=12');
    history.goBack();
  }, []);

  return <div></div>;
};
export default EducationalPage;
