/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 09:57:23
 * @LastEditTime: 2022-04-20 18:30:48
 * @LastEditors: Wu Zhan
 */
import GoBack from '@/components/GoBack';
import styles from './index.less';
import LeaveForm from './Components/LeaveForm';
import MobileCon from '@/components/MobileCon';

const AskForLeave = () => {
  return (
    <MobileCon>
      <GoBack title={'我要请假'} teacher onclick="/teacher/education/askForLeave" />
      <div className={styles.leaveList}>
        <LeaveForm />
      </div>
    </MobileCon>
  );
};

export default AskForLeave;
