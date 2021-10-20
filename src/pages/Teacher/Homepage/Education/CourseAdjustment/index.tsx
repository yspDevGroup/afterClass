import GoBack from "@/components/GoBack";
import styles from './index.less'
import noOrder1 from '@/assets/noOrder1.png';
import {history} from 'umi'

const CourseAdjustment = () => {
  return <div className={styles.CourseAdjustment}>
    <GoBack title={'教师调代课'} teacher onclick='/teacher/home?index=education' />
    <div className={styles.Selected}>
      <div className={styles.noOrder}>
        <div>
          <p>您当前没有任何记录</p>
        </div>
        <img src={noOrder1} alt="" />
      </div>
    </div>
    <div className={styles.apply} onClick={()=>{
      history.push('/teacher/education/courseAdjustment/applys')
    }}><div>+</div>发起申请</div>
  </div>
}

export default CourseAdjustment;
