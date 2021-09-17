import { useEffect, useRef } from 'react';
const EducationalPage: React.FC = (props) => {
  useEffect(() => {
    window.location.href = 'http://moodle.xianyunshipei.com/course/view.php?id=12';
  }, [])

  return (
    <div>
    </div>
  )
}
export default EducationalPage;
