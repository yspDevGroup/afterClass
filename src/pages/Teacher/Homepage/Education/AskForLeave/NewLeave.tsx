/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 09:57:23
 * @LastEditTime: 2021-12-08 17:47:58
 * @LastEditors: Sissle Lynn
 */
import GoBack from '@/components/GoBack';
import styles from './index.less';
import LeaveForm from './Components/LeaveForm';

const AskForLeave = () => {
  return (
    <>
      <GoBack title={'我要请假'} teacher onclick="/teacher/education/askForLeave" />
      <div className={styles.leaveList}>
        <LeaveForm />
      </div>
    </>
  );
};

export default AskForLeave;
